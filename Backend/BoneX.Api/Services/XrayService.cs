using BoneX.Api.Contracts.Xray;
using BoneX.Api.Errors;
using BoneX.Api.Extensions;
using System.Security.Claims;
using System.Text.Json;

namespace BoneX.Api.Services;

public class XrayService(ApplicationDbContext context,
    IHttpContextAccessor httpContextAccessor,
    IWebHostEnvironment hostEnvironment,
    ILogger<XrayService> logger) : IXrayService
{
    private readonly ApplicationDbContext _context = context;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IWebHostEnvironment _hostEnvironment = hostEnvironment;
    private readonly ILogger<XrayService> _logger = logger;

    public async Task<Result<XrayAnalysisResponse>> UploadXrayAsync(UploadXrayRequest request)
    {

        var userId = _httpContextAccessor.HttpContext?.User.GetUserId();

        if (string.IsNullOrEmpty(userId))
            return Result.Failure<XrayAnalysisResponse>(UserErrors.InvalidCredentials);

        if (string.IsNullOrEmpty(_hostEnvironment.WebRootPath))
        {
            _hostEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        }

        // Save photo to uploads folder
        string uploadsFolder = Path.Combine(_hostEnvironment.WebRootPath, "uploads", "xrays");
        Directory.CreateDirectory(uploadsFolder);

        string uniqueFileName = $"{Guid.NewGuid()}_{request.XrayImage.FileName}";
        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

        try
        {
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await request.XrayImage.CopyToAsync(fileStream);
            }

            // Create entity
            var xrayImage = new XrayImage
            {
                PatientId = userId,
                FileName = request.XrayImage.FileName,
                FilePath = $"/uploads/xrays/{uniqueFileName}",
                UploadDate = DateTime.UtcNow,
                Status = XrayStatus.Pending
            };

            await _context.XrayImages.AddAsync(xrayImage);
            await _context.SaveChangesAsync();

            // Queue for AI analysis
            await QueueForAnalysisAsync(xrayImage.Id);

            // Reload the X-ray image to get the updated AI analysis result
            var updatedXray = await _context.XrayImages.FindAsync(xrayImage.Id);

            // Return response
            return Result.Success(new XrayAnalysisResponse(
                Id: updatedXray!.Id,
                FileName: updatedXray.FileName,
                FilePath: updatedXray.FilePath,
                UploadDate: updatedXray.UploadDate,
                Status: updatedXray.Status,
                AiAnalysisResult: updatedXray.AiAnalysisResult, // Include AI result
                AnalysisDate: updatedXray.AnalysisDate
            ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading X-ray image");
            return Result.Failure<XrayAnalysisResponse>(XrayErrors.UploadFailed);
        }
    }

    public async Task<Result<XrayAnalysisResponse>> GetXrayAnalysisAsync(int xrayId)
    {
        var userId = _httpContextAccessor.HttpContext?.User.GetUserId();

        if (string.IsNullOrEmpty(userId))
            return Result.Failure<XrayAnalysisResponse>(UserErrors.InvalidCredentials);

        var xray = await _context.XrayImages
            .AsNoTracking()
            .Include(x => x.DoctorReviews)
            .ThenInclude(r => r.Doctor)
            .FirstOrDefaultAsync(x => x.Id == xrayId);

        if (xray == null)
            return Result.Failure<XrayAnalysisResponse>(XrayErrors.XrayNotFound);

        // Check if the user is the patient or a doctor
        var userRole = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);

        if (xray.PatientId != userId && userRole != UserRoles.Doctor)
            return Result.Failure<XrayAnalysisResponse>(XrayErrors.UnauthorizedAccess);

        var response = new XrayAnalysisResponse(
            Id: xray.Id,
            FileName: xray.FileName,
            FilePath: xray.FilePath,
            UploadDate: xray.UploadDate,
            Status: xray.Status,
            AiAnalysisResult: xray.AiAnalysisResult,
            AnalysisDate: xray.AnalysisDate,
            DoctorReviews: xray.DoctorReviews.Select(r => new DoctorReviewResponse(
                Id: r.Id,
                DoctorId: r.DoctorId,
                DoctorName: $"{r.Doctor.FirstName} {r.Doctor.LastName}",
                ReviewText: r.ReviewText,
                ReviewDate: r.ReviewDate
            )).ToList()
);


        return Result.Success(response);
    }

    public async Task<Result<List<XrayAnalysisResponse>>> GetPatientXraysAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User.GetUserId();

       var user = await _context.Users.FindAsync(userId);

        if (user is null)
            return Result.Failure<List<XrayAnalysisResponse>>(UserErrors.InvalidCredentials);


        var xrays = await _context.XrayImages
            .Where(x => x.PatientId == userId)
            .Include(x => x.DoctorReviews)
            .ThenInclude(r => r.Doctor)
            .OrderByDescending(x => x.UploadDate)
            .ToListAsync();

        var response = xrays.Select(xray => new XrayAnalysisResponse
        (
            Id: xray.Id,
            FileName: xray.FileName,
            FilePath: xray.FilePath,
            UploadDate: xray.UploadDate,
            Status: xray.Status,
            AiAnalysisResult: xray.AiAnalysisResult,
            AnalysisDate: xray.AnalysisDate,
            DoctorReviews: xray.DoctorReviews.Select(r => new DoctorReviewResponse(
                Id: r.Id,
                DoctorId: r.DoctorId,
                DoctorName: $"{r.Doctor.FirstName} {r.Doctor.LastName}",
                ReviewText: r.ReviewText,
                ReviewDate: r.ReviewDate
            )).ToList()
        )).ToList();

        return Result.Success(response);
    }

    public async Task<Result> AddDoctorReviewAsync(AddDoctorReviewRequest request)
    {

        var userId = _httpContextAccessor.HttpContext?.User.GetUserId();

        if (string.IsNullOrEmpty(userId))
            return Result.Failure(UserErrors.InvalidCredentials);

        // Verify user is a doctor
        var currentUser = await _context.Users.FindAsync(userId);

        if (currentUser is null)
            return Result.Failure(UserErrors.InvalidCredentials);

        if (!string.Equals(currentUser.Role, UserRoles.Doctor, StringComparison.OrdinalIgnoreCase))
            return Result.Failure(UserErrors.Unauthorized);

        var xray = await _context.XrayImages
            .Include(x => x.DoctorReviews)
            .FirstOrDefaultAsync(x => x.Id == request.XrayImageId);

        if (xray == null)
            return Result.Failure(XrayErrors.XrayNotFound);

        // Check if doctor already reviewed this X-ray
        if (xray.DoctorReviews is not null && xray.DoctorReviews.Any(r => r.DoctorId == userId))
            return Result.Failure(XrayErrors.XrayAlreadyReviewed);

        var review = new DoctorReview
        {
            XrayImageId = request.XrayImageId,
            DoctorId = userId,
            ReviewText = request.ReviewText
        };

        await _context.DoctorReviews.AddAsync(review);

        // Update X-ray status
        xray.Status = XrayStatus.ReviewedByDoctor;

        await _context.SaveChangesAsync();

        return Result.Success();
    }

    // This method would be implemented with a background service in a real application
    private async Task QueueForAnalysisAsync(int xrayId)
    {

        // Get the X-ray image from the database
        var xray = await _context.XrayImages.FindAsync(xrayId);

        if (xray is null)
        {
            _logger.LogError("X-ray image not found for analysis");
            return;
        }

        // Construct the absolute file path
        string imagePath = Path.Combine(_hostEnvironment.WebRootPath, xray.FilePath.TrimStart('/').Replace('/', '\\'));

        // Ensure file exists
        if (!File.Exists(imagePath))
        {
            _logger.LogError($"File not found for X-ray {xrayId}: {imagePath}");
            return;
        }

        try
        {
            // Prepare HTTP client to call the AI service
            using var httpClient = new HttpClient();
            using var formContent = new MultipartFormDataContent();

            // Read the image and send it
            var fileContent = new ByteArrayContent(await File.ReadAllBytesAsync(imagePath));
            formContent.Add(fileContent, "file", Path.GetFileName(imagePath));

            // Call the Flask API for prediction
            var response = await httpClient.PostAsync("http://164.90.223.123:5000/predict", formContent);

            if (response.IsSuccessStatusCode)
            {
                // Parse the AI response
                var responseContent = await response.Content.ReadAsStringAsync();
                var aiResult = JsonSerializer.Deserialize<Dictionary<string, string>>(responseContent);

                // Update the X-ray with the AI result
                xray.AiAnalysisResult = responseContent; // Save the raw JSON response
                xray.Status = XrayStatus.Analyzed;
                xray.AnalysisDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }
            else
            {
                _logger.LogError($"AI analysis failed for X-ray {xrayId}. Status code: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error processing X-ray analysis for image {xrayId}");
        }
    }

    private string GenerateMockAnalysisResult()
    {
        // In a real application, this would be the result from an AI service
        return @"{
            ""findings"": [
                {
                    ""confidence"": 0.92,
                    ""description"": ""No fractures or dislocations detected"",
                    ""region"": ""bone structure""
                },
                {
                    ""confidence"": 0.85,
                    ""description"": ""Normal bone density"",
                    ""region"": ""overall""
                }
            ],
            ""recommendation"": ""No immediate medical intervention required based on X-ray analysis.""
        }";
    }
}

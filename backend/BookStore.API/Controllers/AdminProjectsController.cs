using Microsoft.AspNetCore.Mvc;

namespace BookStore.API.Controllers;

/// <summary>
/// Admin project catalog (sample in-memory data). Returns paginated rows + total count for client-side pagination math.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class AdminProjectsController : ControllerBase
{
    private static readonly List<AdminProjectDto> AllProjects = BuildSampleProjects();

    [HttpGet]
    public ActionResult GetProjects(int pageNum = 1, int pageSize = 10)
    {
        if (pageNum < 1) pageNum = 1;
        if (pageSize < 1) pageSize = 10;

        var totalNumProjects = AllProjects.Count;
        var page = AllProjects
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new
        {
            projects = page,
            totalNumProjects
        });
    }

    [HttpPost]
    public ActionResult<AdminProjectDto> Create([FromBody] AdminProjectWriteDto body)
    {
        var nextId = AllProjects.Count == 0 ? 1 : AllProjects.Max(p => p.Id) + 1;
        var created = new AdminProjectDto
        {
            Id = nextId,
            Name = body.Name.Trim(),
            Type = body.Type.Trim(),
            RegionalProgram = body.RegionalProgram.Trim(),
            Impact = body.Impact.Trim(),
            Phase = body.Phase.Trim(),
            Status = body.Status.Trim()
        };
        AllProjects.Add(created);
        return Ok(created);
    }

    [HttpPut("{id:int}")]
    public ActionResult<AdminProjectDto> Update(int id, [FromBody] AdminProjectWriteDto body)
    {
        var existing = AllProjects.FirstOrDefault(p => p.Id == id);
        if (existing is null)
            return NotFound();

        existing.Name = body.Name.Trim();
        existing.Type = body.Type.Trim();
        existing.RegionalProgram = body.RegionalProgram.Trim();
        existing.Impact = body.Impact.Trim();
        existing.Phase = body.Phase.Trim();
        existing.Status = body.Status.Trim();
        return Ok(existing);
    }

    private static List<AdminProjectDto> BuildSampleProjects()
    {
        var types = new[] { "Infrastructure", "Education", "Health", "Agriculture" };
        var regions = new[] { "East Africa", "Southeast Asia", "Caribbean", "Andean" };
        var impacts = new[] { "High", "Medium", "Emerging" };
        var phases = new[] { "Planning", "Active", "Scaling", "Closure" };
        var statuses = new[] { "Draft", "Approved", "In progress", "On hold", "Complete" };

        var list = new List<AdminProjectDto>();
        for (var i = 1; i <= 47; i++)
        {
            list.Add(new AdminProjectDto
            {
                Id = i,
                Name = $"Regional Initiative {i:D2}",
                Type = types[i % types.Length],
                RegionalProgram = regions[i % regions.Length],
                Impact = impacts[i % impacts.Length],
                Phase = phases[i % phases.Length],
                Status = statuses[i % statuses.Length]
            });
        }

        return list;
    }
}

public class AdminProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string RegionalProgram { get; set; } = string.Empty;
    public string Impact { get; set; } = string.Empty;
    public string Phase { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class AdminProjectWriteDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string RegionalProgram { get; set; } = string.Empty;
    public string Impact { get; set; } = string.Empty;
    public string Phase { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

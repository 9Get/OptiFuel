using System.ComponentModel.DataAnnotations;

namespace OptiFuel.API.DTOs;

public class ResourceQueryParameters
{
    private const int MAX_PAGE_SIZE = 50;

    [Range(1, int.MaxValue)]
    public int PageNumber { get; set; } = 1;

    private int _pageSize = 10;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MAX_PAGE_SIZE) ? MAX_PAGE_SIZE : value;
    }

    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortOrder { get; set; } = "desc";
}
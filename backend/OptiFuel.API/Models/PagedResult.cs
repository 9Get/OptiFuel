namespace OptiFuel.API.Models;

public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public PaginationMetadata Metadata { get; set; }
}

public class PaginationMetadata
{
    public int TotalItemCount { get; set; }
    public int PageSize { get; set; }
    public int CurrentPage { get; set; }
    public int TotalPageCount { get; set; }
}
interface SearchParams {
  query: string;
  filters?: {
    category?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  sort?: {
    field: string;
    order: "ASC" | "DESC";
  };
  skip?: number;
  limit?: number;
}

interface SearchResult {
  items: any[];
  total: number;
}

@Injectable()
export class PostsService {
  async search(params: SearchParams): Promise<SearchResult> {
    const { query, filters, sort, skip = 0, limit = 10 } = params;

    const searchQuery: any = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };

    if (filters?.category) {
      searchQuery.category = filters.category;
    }

    if (filters?.dateRange) {
      searchQuery.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end,
      };
    }

    const sortQuery: any = {};
    if (sort) {
      sortQuery[sort.field] = sort.order === "ASC" ? 1 : -1;
    } else {
      sortQuery.createdAt = -1;
    }

    const [items, total] = await Promise.all([
      this.postModel
        .find(searchQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate("author", "name profileImage")
        .populate("challenge", "title")
        .exec(),
      this.postModel.countDocuments(searchQuery),
    ]);

    return { items, total };
  }
}

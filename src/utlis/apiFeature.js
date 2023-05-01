export class apiFeature {
  constructor(mongooeQuary, queryData) {
    this.mongooeQuary = mongooeQuary;
    this.queryData = queryData;
  }
  pagination() {
    let { page, limit } = this.queryData;
    if (page <= 0) {
      page = 1;
    }
    if (!limit || limit <= 0) {
      limit = 3;
    }
    this.mongooeQuary.skip((page - 1) * limit).limit(limit);
    return this;
  }
  fillter() {
    const queryParams = { ...this.queryData };
    const unWantedQuerys = ["page", "limit", "sort", "search", "select"];
    unWantedQuerys.forEach((query) => {
      delete queryParams[query];
    });
    const findFillter = JSON.parse(
      JSON.stringify(queryParams).replace(
        /(gt|gte|lt|in|nin|eq|neq)/g,
        (match) => `$${match}`
      )
    );
    this.mongooeQuary.find(findFillter);
    return this;
  }
  sort() {
    this.mongooeQuary.sort(this.queryData.sort?.replaceAll(",", " "));
    return this;
  }
  search() {
    const regex = this.queryData.search?this.queryData.search:""
    
      this.mongooeQuary.find({
        $or: [
          { name: { $regex: regex, $options: "i" } },
          { description: { $regex: regex, $options: "i" } },
        ],
      });
      return this;
  }
  select() {
    this.mongooeQuary.select(this.queryData.select?.replaceAll(",", " "));
    return this;
  }
}

export default () => {
  return async (ctx, next) => {
    await next();
    
    if (ctx.response.body && ctx.response.data) {
      const data = Array.isArray(ctx.response.data) ? ctx.response.data : [ctx.response.data];
      
      for (const item of data) {
        if (item.upvotes !== undefined && item.downvotes !== undefined) {
          item.statistics = {
            upvotes: item.upvotes,
            downvotes: item.downvotes,
            total: item.upvotes + item.downvotes,
            score: item.upvotes - item.downvotes,
            ratio: item.upvotes + item.downvotes > 0 
              ? (item.upvotes / (item.upvotes + item.downvotes) * 100).toFixed(2) 
              : '0'
          };
        }
      }
      
      ctx.response.body = ctx.response.body;
    }
  };
};
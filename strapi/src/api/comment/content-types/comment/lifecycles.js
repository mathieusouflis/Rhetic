module.exports = {
  beforeUpdate(event) {
    const { data } = event.params;
    if (data && (data.upvotes !== undefined || data.downvotes !== undefined)) {
      const upvotes = data.upvotes !== undefined ? data.upvotes : (event.result?.upvotes || 0);
      const downvotes = data.downvotes !== undefined ? data.downvotes : (event.result?.downvotes || 0);
      data.total_votes = upvotes - downvotes;
    }
  },
  
  async beforeCreate(event) {
    const { data } = event.params;
    const upvotes = data.upvotes || 0;
    const downvotes = data.downvotes || 0;
    data.total_votes = upvotes - downvotes;
  }
};
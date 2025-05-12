const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::user-follow.user-follow",
  ({ strapi }) => ({
    async follow(ctx) {
      const { id } = ctx.params;
      const currentUserId = ctx.state.user.id;

      if (!id) {
        return ctx.badRequest("id is required");
      }

      if (id == currentUserId) {
        return ctx.badRequest("You cannot follow yourself");
      }

      const existingFollow = await strapi.entityService.findMany(
        "api::user-follow.user-follow",
        {
          filters: {
            follower: currentUserId,
            following: id,
          },
        }
      );

      if (existingFollow.length > 0) {
        return ctx.badRequest("You are already following this user");
      }

      const follow = await strapi.entityService.create(
        "api::user-follow.user-follow",
        {
          data: {
            follower: currentUserId,
            following: id,
          },
        }
      );

      return ctx.send({
        message: "User followed successfully",
        followed: true,
      });
    },

    async unfollow(ctx) {
      const { id } = ctx.params;
      const currentUserId = ctx.state.user.id;

      if (!id) {
        return ctx.badRequest("id is required");
      }

      const existingFollow = await strapi.entityService.findMany(
        "api::user-follow.user-follow",
        {
          filters: {
            follower: currentUserId,
            following: id,
          },
        }
      );

      if (existingFollow.length === 0) {
        return ctx.badRequest("You are not following this user");
      }

      await strapi.entityService.delete(
        "api::user-follow.user-follow",
        existingFollow[0].id
      );

      return ctx.send({
        message: "User unfollowed successfully",
        followed: false,
      });
    },
  })
);

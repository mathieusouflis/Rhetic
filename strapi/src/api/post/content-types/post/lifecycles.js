module.exports = {
  beforeDelete: async function (event) {
    const { id } = event.params;
    
    try {
      console.log(`=== DÉBUT SUPPRESSION POST ${id} ===`);
      
      const comments = await strapi.db.query('api::comment.comment').findMany({
        where: { post: id }
      });
      
      console.log(`${comments.length} commentaires trouvés pour le post ${id}`);
      
      if (comments && comments.length > 0) {
        for (const comment of comments) {
          console.log(`Suppression du commentaire ${comment.id}...`);
          await strapi.entityService.delete('api::comment.comment', comment.id);
          console.log(`Commentaire ${comment.id} supprimé`);
        }
      }
      
      console.log(`=== FIN SUPPRESSION POST ${id} ===`);
    } catch (error) {
      console.error('Erreur dans beforeDelete du post:', error);
    }
  }
};
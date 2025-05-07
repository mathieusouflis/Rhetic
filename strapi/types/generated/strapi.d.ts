declare module '@strapi/strapi' {
    export namespace Core {
      interface Strapi {
        entityService: EntityService;
      }
    }
  
    export interface EntityService {
      findOne: <T>(uid: string, id: string | number, params?: any) => Promise<T>;
      find: <T>(uid: string, params?: any) => Promise<T[]>;
      create: <T>(uid: string, params: { data: any }) => Promise<T>;
      update: <T>(uid: string, id: string | number, params: { data: any }) => Promise<T>;
      delete: <T>(uid: string, id: string | number) => Promise<T>;
    }
  
    export namespace factories {
      function createCoreController(uid: string, config?: any): any;
      function createCoreRouter(uid: string, config?: any): any;
      function createCoreService(uid: string, config?: any): any;
    }
  
    export interface Schema {
    }
  
    export interface Struct {
    }
  }
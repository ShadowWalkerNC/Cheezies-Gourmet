// Base44 removed — universal stub via Proxy so ANY entity.method() is a safe no-op
const entityStub = {
  list:   async () => [],
  filter: async () => [],
  get:    async () => null,
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => {},
};

const entitiesProxy = new Proxy({}, {
  get: () => entityStub,
});

export const base44 = {
  entities: entitiesProxy,
  functions: { invoke: async () => ({}) },
  auth: {
    getUser: async () => null,
    signIn: async () => {},
    signOut: async () => {},
  },
};

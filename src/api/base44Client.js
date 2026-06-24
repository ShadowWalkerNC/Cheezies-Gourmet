// Legacy stub — safe no-op so any remaining base44 imports don't crash
const entityStub = {
  list:        async () => [],
  filter:      async () => [],
  get:         async () => null,
  create:      async () => ({}),
  update:      async () => ({}),
  delete:      async () => {},
  count:       async () => 0,
  subscribe:   (cb) => { cb([]); return () => {}; },
  unsubscribe: () => {},
};

const entitiesProxy = new Proxy({}, { get: () => entityStub });

export const base44 = {
  entities: entitiesProxy,
  functions: { invoke: async () => ({}) },
  auth: { getUser: async () => null, signIn: async () => {}, signOut: async () => {} },
};

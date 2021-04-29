import * as Constants from "../Common/Constants";
import * as DataModels from "../Contracts/DataModels";
import { userContext } from "../UserContext";
import { DefaultExperienceUtility } from "./DefaultExperienceUtility";

describe("Default Experience Utility", () => {
  describe("getDefaultExperienceFromApiKind()", () => {
    function runScenario(apiKind: number, expectedExperience: string): void {
      const resolvedExperience = DefaultExperienceUtility.getDefaultExperienceFromApiKind(apiKind);
      expect(resolvedExperience).toEqual(expectedExperience);
    }

    describe("On SQL", () => {
      it("should return SQL", () => runScenario(DataModels.ApiKind.SQL, Constants.DefaultAccountExperience.DocumentDB));
    });

    describe("On MongoDB", () => {
      it("should return MongoDB", () =>
        runScenario(DataModels.ApiKind.MongoDB, Constants.DefaultAccountExperience.MongoDB));
    });

    describe("On Table", () => {
      it("should return Table", () => runScenario(DataModels.ApiKind.Table, Constants.DefaultAccountExperience.Table));
    });

    describe("On Cassandra", () => {
      it("should return Cassandra", () =>
        runScenario(DataModels.ApiKind.Cassandra, Constants.DefaultAccountExperience.Cassandra));
    });

    describe("On Graph", () => {
      it("should return Graph", () => runScenario(DataModels.ApiKind.Graph, Constants.DefaultAccountExperience.Graph));
    });

    describe("On unknown", () => {
      it("should return Default", () => runScenario(-1, Constants.DefaultAccountExperience.Default));
    });
  });

  describe("getApiKindFromDefaultExperience()", () => {
    function runScenario(defaultExperience: typeof userContext.apiType, expectedApiKind: number): void {
      const resolvedApiKind = DefaultExperienceUtility.getApiKindFromDefaultExperience(defaultExperience);
      expect(resolvedApiKind).toEqual(expectedApiKind);
    }

    describe("On SQL", () => {
      it("should return SQL", () => runScenario("SQL", DataModels.ApiKind.SQL));
    });

    describe("On MongoDB", () => {
      it("should return MongoDB", () => runScenario("Mongo", DataModels.ApiKind.MongoDB));
    });

    describe("On Table", () => {
      it("should return Table", () => runScenario("Tables", DataModels.ApiKind.Table));
    });

    describe("On Cassandra", () => {
      it("should return Cassandra", () => runScenario("Cassandra", DataModels.ApiKind.Cassandra));
    });

    describe("On Graph", () => {
      it("should return Graph", () => runScenario("Gremlin", DataModels.ApiKind.Graph));
    });

    describe("On null", () => {
      it("should return SQL", () => runScenario(null, DataModels.ApiKind.SQL));
    });
  });

  describe("getDefaultExperienceFromDatabaseAccount()", () => {
    function runScenario(databaseAccount: DataModels.DatabaseAccount, expectedDefaultExperience: string): void {
      const resolvedExperience = DefaultExperienceUtility.getDefaultExperienceFromDatabaseAccount(databaseAccount);
      expect(resolvedExperience).toEqual(expectedDefaultExperience);
    }

    const databaseAccountWithWrongTagsAndCapabilities: DataModels.DatabaseAccount = {
      id: "test",
      kind: "GlobalDocumentDB",
      name: "test",
      location: "somewhere",
      type: "DocumentDB",
      tags: {
        defaultExperience: "Gremlin (graph)",
      },
      properties: {
        documentEndpoint: "",
        cassandraEndpoint: "",
        gremlinEndpoint: "",
        tableEndpoint: "",
        capabilities: [
          {
            name: Constants.CapabilityNames.EnableGremlin,
            description: "something",
          },
        ],
      },
    };

    const databaseAccountWithApiKind: DataModels.DatabaseAccount = {
      id: "test",
      kind: Constants.AccountKind.MongoDB,
      name: "test",
      location: "somewhere",
      type: "DocumentDB",
      tags: {},
      properties: {
        documentEndpoint: "",
        cassandraEndpoint: "",
        gremlinEndpoint: "",
        tableEndpoint: "",
        capabilities: [
          {
            name: Constants.CapabilityNames.EnableGremlin,
            description: "something",
          },
        ],
      },
    };

    describe("Disregard tags", () => {
      it("should return Graph", () =>
        runScenario(databaseAccountWithWrongTagsAndCapabilities, Constants.DefaultAccountExperience.Graph));
    });

    describe("Respect Kind over capabilities", () => {
      it("should return MongoDB", () =>
        runScenario(databaseAccountWithApiKind, Constants.DefaultAccountExperience.MongoDB));
    });
  });
});

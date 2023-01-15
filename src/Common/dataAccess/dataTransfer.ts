import { initiateDataTransfer, pollDataTransferJob } from "Utils/arm/generatedClients/cosmos/dataTransfer";
import { userContext } from "../../UserContext";

export async function createDataTransferJob(
  jobId: string,
  sourceDatabaseName: string,
  sourceCollectionName: string,
  targetDatabaseName: string,
  targetCollectionName: string
): Promise<any> {
  return createDataTransferJobWithARM(
    jobId,
    sourceDatabaseName,
    sourceCollectionName,
    targetDatabaseName,
    targetCollectionName
  );
}

export async function trackDataTransferJob(jobId: string): Promise<any> {
  const { subscriptionId, resourceGroup, databaseAccount } = userContext;
  return pollDataTransferJob(jobId, subscriptionId, resourceGroup, databaseAccount.name);
}

function createDataTransferJobWithARM(
  jobId: string,
  sourceDatabaseName: string,
  sourceCollectionName: string,
  targetDatabaseName: string,
  targetCollectionName: string
): Promise<any> {
  const { subscriptionId, resourceGroup, apiType, databaseAccount } = userContext;
  switch (apiType) {
    case "SQL":
      return initiateDataTransfer(
        jobId,
        subscriptionId,
        resourceGroup,
        databaseAccount.name,
        sourceDatabaseName,
        sourceCollectionName,
        targetDatabaseName,
        targetCollectionName
      );
    case "Cassandra":
      return initiateDataTransfer(
        jobId,
        subscriptionId,
        resourceGroup,
        databaseAccount.name,
        sourceDatabaseName,
        sourceCollectionName,
        targetDatabaseName,
        targetCollectionName
      );
    default:
      throw new Error(`Unsupported for type: ${apiType}`);
  }
}

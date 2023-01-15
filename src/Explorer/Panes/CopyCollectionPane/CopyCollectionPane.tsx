import { Dropdown, IDropdownOption, Stack, Text } from "@fluentui/react";
import { createDataTransferJob, trackDataTransferJob } from "Common/dataAccess/dataTransfer";
import { getErrorMessage } from "Common/ErrorHandlingUtils";
import { RightPaneForm, RightPaneFormProps } from "Explorer/Panes/RightPaneForm/RightPaneForm";
import { useDatabases } from "Explorer/useDatabases";
import { useSidePanel } from "hooks/useSidePanel";
import React, { FunctionComponent, useState } from "react";
import * as NotificationConsoleUtils from "Utils/NotificationConsoleUtils";

export interface CopyCollectionPaneProps {
  sourceDatabaseId: string;
  sourceCollectionId: string;
}

export const CopyCollectionPane: FunctionComponent<CopyCollectionPaneProps> = ({
  sourceDatabaseId,
  sourceCollectionId,
}: CopyCollectionPaneProps) => {
  const closeSidePanel = useSidePanel((state) => state.closeSidePanel);
  const [formError, setFormError] = useState<string>("");
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [targetDatabaseId, setTargetDatabaseId] = useState(null);
  const [targetCollectionId, setTargetCollectionId] = useState(null);
  const onSubmit = async (): Promise<void> => {
    if (!targetDatabaseId || !targetCollectionId) {
      const errorMessage = `Missing target ${!targetDatabaseId ? "database" : ""}${
        !targetDatabaseId && !targetCollectionId ? ", " : ""
      } ${!targetCollectionId ? "collection" : ""}`;
      setFormError(errorMessage);
      return;
    }
    setIsSubmittingJob(true);
    try {
      const dataTransferJobId = `dtsjob_${sourceDatabaseId}_${sourceCollectionId}_${targetDatabaseId}_${targetCollectionId}_${Date.now()}`;
      await createDataTransferJob(
        dataTransferJobId,
        sourceDatabaseId,
        sourceCollectionId,
        targetDatabaseId,
        targetCollectionId
      );
      NotificationConsoleUtils.logConsoleInfo(`Data transfer job ${dataTransferJobId} initiated`);
      trackDataTransferJob(dataTransferJobId);
      closeSidePanel();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setFormError(errorMessage);
      NotificationConsoleUtils.logConsoleError(errorMessage);
      setIsSubmittingJob(false);
    }
  };

  const getDatabaseOptions = (): IDropdownOption[] => {
    return useDatabases.getState().databases?.map((database) => ({
      key: database.id(),
      text: database.id(),
    }));
  };

  const getCollectionsOptions = (): IDropdownOption[] => {
    return useDatabases
      .getState()
      .databases.find((database) => database.id() === targetDatabaseId)
      ?.collections()
      ?.map((collection) => ({
        key: collection.id(),
        text: collection.id(),
      }));
  };

  const props: RightPaneFormProps = {
    formError,
    isExecuting: isSubmittingJob,
    submitButtonText: "Submit",
    onSubmit,
  };
  return (
    <RightPaneForm {...props}>
      <div className="panelFormWrapper">
        <div className="panelMainContent">
          <Stack>
            <Stack tokens={{ childrenGap: "m" }}>
              <Text className="panelTextBold" variant="medium">
                Data transfer source
              </Text>
              <Stack>
                <Text className="panelTextBold" variant="small">
                  Database id
                </Text>
                <input
                  name="sourceDatabaseId"
                  id="sourceDatabaseId"
                  size={40}
                  className="panelTextField"
                  disabled={true}
                  value={sourceDatabaseId}
                ></input>
                <Text className="panelTextBold" variant="small">
                  Collection id
                </Text>
                <input
                  name="sourceColectionId"
                  id="sourceCollectionId"
                  size={40}
                  className="panelTextField"
                  disabled={true}
                  value={sourceCollectionId}
                ></input>
              </Stack>
            </Stack>
            <Stack tokens={{ childrenGap: "m" }}>
              <Text className="panelTextBold" variant="medium">
                Data transfer target
              </Text>
              <Stack>
                <Text className="panelTextBold" variant="small">
                  Database id
                </Text>
                <Dropdown
                  styles={{ title: { height: 27, lineHeight: 27 }, dropdownItem: { fontSize: 12 } }}
                  style={{ width: 300, fontSize: 12 }}
                  placeholder="Choose an existing database"
                  options={getDatabaseOptions()}
                  onChange={(event, option?) => setTargetDatabaseId(option.key)}
                  responsiveMode={999}
                />
                <Text className="panelTextBold" variant="small">
                  Collection id
                </Text>
                <Dropdown
                  styles={{ title: { height: 27, lineHeight: 27 }, dropdownItem: { fontSize: 12 } }}
                  style={{ width: 300, fontSize: 12 }}
                  placeholder="Choose an existing collection"
                  options={getCollectionsOptions()}
                  onChange={(event, option?) => setTargetCollectionId(option.key)}
                  responsiveMode={999}
                />
              </Stack>
            </Stack>
          </Stack>
        </div>
      </div>
    </RightPaneForm>
  );
};

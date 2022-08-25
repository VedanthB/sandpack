import { ClasserProvider } from "@code-hike/classer";
import * as React from "react";

import { SandpackThemeProvider } from "../contexts/themeContext";
import type {
  SandpackContext,
  SandpackInternalProvider,
  SandpackProviderState,
  SandpackProviderProps,
} from "../types";

import { useAppState } from "./utils/useAppState";
import { useClient } from "./utils/useClient";
import { useFiles } from "./utils/useFiles";

const Sandpack = React.createContext<SandpackContext | null>(null);

export const SandpackProvider: React.FC<SandpackProviderProps> = (props) => {
  const { children, options, style, className, theme } = props;

  const [fileState, fileOperations] = useFiles(props);
  const [clientState, clientOperations] = useClient(props, fileState);
  const [appState] = useAppState(props, fileState.files);

  React.useEffect(() => {
    clientOperations.initializeSandpackIframe();
  }, [clientOperations]);

  const sandpackContext: SandpackContext = {
    ...fileState,
    ...clientState,
    ...appState,

    ...fileOperations,
    ...clientOperations,
  };

  return (
    <Sandpack.Provider value={sandpackContext}>
      <ClasserProvider classes={options?.classes}>
        <SandpackThemeProvider
          className={className}
          style={style}
          theme={theme}
        >
          {children}
        </SandpackThemeProvider>
      </ClasserProvider>
    </Sandpack.Provider>
  );
};

/**
 * @category Provider
 */
const SandpackConsumer = Sandpack.Consumer;

export { SandpackConsumer, Sandpack as SandpackReactContext };
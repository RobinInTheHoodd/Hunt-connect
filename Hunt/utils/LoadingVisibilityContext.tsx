// ModalVisibilityContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface LoadingVisibilityContextType {
  isLoadingVisible: boolean;
  setLoadingVisible: (isVisible: boolean) => void;
}

const LoadingVisibilityContext = createContext<
  LoadingVisibilityContextType | undefined
>(undefined);

interface LoadingVisibilityProviderProps {
  children: ReactNode;
}

export const LoadingVisibilityProvider: React.FC<
  LoadingVisibilityProviderProps
> = ({ children }) => {
  const [isLoadingVisible, setLoadingVisible] = useState<boolean>(false);

  return (
    <LoadingVisibilityContext.Provider
      value={{ isLoadingVisible, setLoadingVisible }}
    >
      {children}
    </LoadingVisibilityContext.Provider>
  );
};

export const useLoadingVisibility = (): LoadingVisibilityContextType => {
  const context = useContext(LoadingVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useLoadingVisibility must be used within a LoadingVisibilityProvider"
    );
  }
  return context;
};

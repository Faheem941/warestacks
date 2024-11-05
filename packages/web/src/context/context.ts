import { createContext } from 'react';

import { ISelf } from '@warestacks/common/model';

interface IContextProps {
  self?: ISelf;
  isSelfLoading: boolean;
}

const AppContext = createContext<IContextProps>({
  self: undefined,
  isSelfLoading: true,
});

export default AppContext;

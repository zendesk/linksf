/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import createBrowserHistory from 'history/lib/createBrowserHistory'
import useBeforeUnload from 'history/lib/useBeforeUnload'
import useQueries from 'history/lib/useQueries'

const history = useQueries(useBeforeUnload(createBrowserHistory))()

export default history

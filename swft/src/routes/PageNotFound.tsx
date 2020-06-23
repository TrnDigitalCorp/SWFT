import * as React from 'react';
import {Link,Icon} from 'office-ui-fabric-react';
import {Redirect} from 'react-router-dom';
import { useBoolean } from '@uifabric/react-hooks';
interface IPageNotFoundProps {
}

const PageNotFound: React.FunctionComponent<IPageNotFoundProps> = (props) => {
const [shouldRedirect, { toggle: toggleRedirect }] = useBoolean(false);
  return (
    <div className="centeredContainer" style={{textAlign:"center",top: '45%'}}>
            <h1>404 - Page Not found</h1>
            {shouldRedirect?<Redirect to={'/Home'} />:''}
            <h3>
                <Link onClick={toggleRedirect} style={{fontSize:24,color:"black"}}>
                <Icon iconName="NavigateBack"
                    className="iconPadClasss"/>
                    Home
                </Link>
            </h3>
    </div>
  );
};

export default PageNotFound;

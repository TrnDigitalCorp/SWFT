import * as React from 'react';
import AppConfig from '../../Constans';

export const AppFooter = () => (
    <footer className="footer">
        <div className="AppFooter">
            <div
                dangerouslySetInnerHTML={{__html: AppConfig.Footer}}
            ></div>
        </div>
    </footer>
);
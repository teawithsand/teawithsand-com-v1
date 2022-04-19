import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter, Routes, Route, BrowserRouter } from 'react-router-dom';

import { useParams } from 'react-router';

import Navbar from "@app/components/Navbar"
import Footer from "@app/components/Footer"

import '../styles/app.scss';
import configureStore from '@app/actions/store';
import { Provider } from 'react-redux';
import Home from '@app/pages/Home';
import NotFound from '@app/pages/NotFound';
import { IntlProvider } from 'react-intl';
import { i18nConfig } from '@app/intl/config';
import About from '@app/pages/About/About';
import Portfolio from '@app/pages/About/Portfolio';
import Login from '@app/pages/Login';
import { loadAndRegisterServiceWorker } from '@app/util/serviceWorker';
import { Store } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Persistor } from 'redux-persist/es/types';
import userOperationQueue from '@app/domain/user/queue';
import { loginCookieTokenUser } from '@app/domain/user/login';
import { ReduxToastDisplay } from '@app/components/ToastDisplay';
import Profile from '@app/pages/Profile';

import { initializeRecaptchaToken } from '@app/util/captcha';
import Register from '@app/pages/Register';
import ResetPasswordInit from '@app/pages/ResetPasswordInit';
import ChangePassword from '@app/pages/ChangePassword';
import AfterRegister from '@app/pages/AfterRegister';
import ResetPasswordFinalize from '@app/pages/ResetPasswordFinalize';
import ResendRegistrationEmail from '@app/pages/ResendRegistrationEmail';
import ConfirmRegistration from '@app/pages/ConfirmRegistration';
import CreateWordSet from '@app/pages/Langka/CreateWordSet';
import ShowWordSet from '@app/pages/Langka/ShowWordSet';
import ListWordSet from '@app/pages/Langka/ListWordSet';
import PlayBrowseWordSet from '@app/pages/Langka/PlayBrowseWordSet';
import CookieBanner from '@app/components/helper/CookieBanner';

// TODO(teawithsand): disable this in prod builds
// eslint-disable-next-line
const consoleError = console.error.bind(console);
// eslint-disable-next-line
console.error = (candidate, ...args) => {
    const expr = /@formatjs\/intl Error MISSING_TRANSLATION/
    if (
        (typeof candidate === 'string' && expr.test(candidate)) ||
        (candidate instanceof Error && typeof candidate.message === "string" && expr.test(candidate.message))
    ) {
        return;
    }
    consoleError(candidate, ...args);
};

const initBody = () => {
    document.body.className = "d-flex flex-column min-vh-100"
    document.getElementById("root").className = "d-flex flex-column min-vh-100"
}

/**
 * @deprecated This does not work, please remove it
 */
const withRouteParams = (
    Wrapper: (props: { params: any }) => React.ReactElement
) => {
    const params = useParams()
    return <Wrapper params={params} />
}


const App = () => (
    <>
        <Navbar />
        <main>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/profile/register' element={<Register />} />
                <Route path='/profile/after-register' element={<AfterRegister />} />
                <Route path='/profile/confirm-register' element={<ConfirmRegistration />} />
                <Route path='/profile/login' element={<Login />} />
                <Route path='/profile/register-resend-email' element={<ResendRegistrationEmail />} />

                <Route path='/profile/change-password' element={<ChangePassword />} />

                <Route path='/profile/view/:uid' element={
                    withRouteParams(
                        (props) => <Profile type="public" uid={props.params.uid} />
                    )
                } />
                <Route path='/profile/view/:uid/details' element={
                    withRouteParams(
                        (props) => <Profile type="secret" uid={props.params.uid} />
                    )
                } />
                <Route path='/profile/reset-password/init' element={<ResetPasswordInit />} />
                <Route path='/profile/reset-password/finalize' element={<ResetPasswordFinalize />} />

                <Route path='/langka/word-set/create' element={<CreateWordSet />} />
                <Route path='/langka/word-set/show/:id' element={<ShowWordSet type="public" />} />
                <Route path='/langka/word-set/show/:id/details' element={<ShowWordSet type="secret" />} />

                <Route path='/langka/word-set/list/public' element={<ListWordSet type="public" />} />
                <Route path='/langka/word-set/list/owned' element={<ListWordSet type="owned" />} />
                <Route path='/langka/word-set/play/:id/browse' element={<PlayBrowseWordSet />} />


                <Route path='/about-me' element={<About />} />
                <Route path='/portfolio' element={<Portfolio />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
        <ReduxToastDisplay />
        <CookieBanner />
        <Footer />
    </>
);

// TODO(teawithsand): load theme from local storage/cookie, so it's not reset after quitting page
//  or store on backend as user preference

const AppWithRouter = (props: {
    store: Store,
    persistor: Persistor,
}) => (
    <PersistGate loading={null} persistor={props.persistor}>
        <React.StrictMode>
            <IntlProvider
                locale={i18nConfig.locale}
                defaultLocale={i18nConfig.locale}
                messages={i18nConfig.messages}
            >
                <Provider store={props.store}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Provider>
            </IntlProvider>
        </React.StrictMode>
    </PersistGate>
)

const initApp = async () => {
    initializeRecaptchaToken()

    // TODO(teawithsand): here check if we are running in capacitor
    const { persistor, store } = await configureStore()

    userOperationQueue.enqueueOperation(async () => {
        try {
            const result = await loginCookieTokenUser()
            if (result !== null)
                store.dispatch(result.action)
        } catch (e) {
            // TODO(teawithsand): notify user about that
            //  toast maybe?
            console.error("filed to login user from cookie token", { e })
        }

    })

    initBody()
    render(<AppWithRouter persistor={persistor} store={store} />, document.getElementById('root'));
}

document.title = "teawithsand.com"

document.addEventListener("DOMContentLoaded", () => {
    initApp()
});


// disable SW for dev, since it's caching is annoying and sometimes causes old versions of code to be loaded
// it integrates badly with hot reload
window.addEventListener("load", () => {
    // disable SW for the time being 
    // Website is fast enough anyway
    // loadAndRegisterServiceWorker()
})
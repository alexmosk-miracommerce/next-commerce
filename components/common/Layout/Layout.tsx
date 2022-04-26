import cn from 'classnames'
import dynamic from 'next/dynamic'
import s from './Layout.module.css'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useUI } from '@components/ui/context'
import { Navbar, Footer } from '@components/common'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Button, Modal, LoadingDots } from '@components/ui'
import CartSidebarView from '@components/cart/CartSidebarView'

import LoginView from '@components/auth/LoginView'
import { CommerceProvider } from '@framework'
import type { Page } from '@framework/common/get-all-pages'

const Loading = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <LoadingDots /> : null
}

const dynamicProps = {
  loading: () => <Loading />,
}

const SignUpView = dynamic(
  () => import('@components/auth/SignUpView'),
  dynamicProps
)

const ForgotPassword = dynamic(
  () => import('@components/auth/ForgotPassword'),
  dynamicProps
)

const FeatureBar = dynamic(
  () => import('@components/common/FeatureBar'),
  dynamicProps
)

interface Props {
  pageProps: {
    pages?: Page[]
    commerceFeatures: Record<string, boolean>
  }
}

const Layout: FC<Props> = ({
  children,
  pageProps: { commerceFeatures, ...pageProps },
}) => {
  const { displaySidebar, displayModal, closeSidebar, closeModal, modalView } =
    useUI()
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const [showCookiesBar, setShowCookiesBar] = useState(false)
  const { locale = 'en-US' } = useRouter()

  useEffect(() => {
    setShowCookiesBar(true)
  }, [])

  return (
    <CommerceProvider locale={locale}>
      <div className={cn(s.root)}>
        <Navbar />
        <main className="fit">{children}</main>
        <Footer pages={pageProps.pages} />

        <Modal open={displayModal} onClose={closeModal}>
          {modalView === 'LOGIN_VIEW' && <LoginView />}
          {modalView === 'SIGNUP_VIEW' && <SignUpView />}
          {modalView === 'FORGOT_VIEW' && <ForgotPassword />}
        </Modal>

        <Sidebar open={displaySidebar} onClose={closeSidebar}>
          <CartSidebarView />
        </Sidebar>
      </div>

      {showCookiesBar && (
        <FeatureBar
          title="This site uses cookies to improve your experience. By clicking, you agree to our Privacy Policy."
          hide={acceptedCookies}
          action={
            <Button className="mx-5" onClick={() => onAcceptCookies()}>
              Accept cookies
            </Button>
          }
        />
      )}
    </CommerceProvider>
  )
}

export default Layout

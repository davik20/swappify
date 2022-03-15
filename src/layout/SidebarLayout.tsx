import React, { ReactNode, useEffect } from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import CssBaseline from '@material-ui/core/CssBaseline'
import { color, gradients } from '../styles/theme'
import { spaceBetween } from '../styles/layout'
import { goTo } from '../hooks/utils'
import AvatarMenu from '../components/AvatarMenu'
import WindowHeightContainer from './WindowHeightContainer'
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks'
import { setAccount, setChainId } from '../store/swap/swapSlice'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
    },
    appBar: {
      backgroundColor: color.white,
      boxShadow: 'none',
      borderBottom: `1px solid ${color.grey}`,
      color: color.grey,
      zIndex: theme.zIndex.drawer - 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      height: '90px',
    },
    appBarHeaderLogo: {
      marginLeft: '1rem',
      marginRight: '9rem',
    },
    swapButton: {
      backgroundColor: 'white',
      padding: '.8rem 2rem',
      borderRadius: '1rem',
      fontSize: '1.1rem',
      cursor: 'pointer',
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      height: '90px',
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    middleLogo: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    toolbarHeader: {
      ...spaceBetween,
      backgroundColor: color.primaryPink,
      height: '90px',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      height: '100%',
    },
    noPadding: {
      padding: 0,
    },
    contentBackground: {
      backgroundImage: gradients.blackPink,
      height: '100%',
    },
  }),
)

interface SidebarProps {
  noPadding?: boolean
  children?: ReactNode
  includeWindowHeightContainer?: boolean
  allowOverflow?: boolean
}

const SidebarLayout = (props: SidebarProps) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const [isSidebarOpen, _setSidebarOpen] = React.useState(false)
  const web3 = useAppSelector(store => store.swap.web3)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        dispatch(setChainId(Number(chainId[2])))
      })
      window.ethereum.on('accountsChanged', accounts => {
        dispatch(setAccount(accounts[0]))
      })
    }
  }, [])

  const content = <div className={classes.contentBackground}>{props.children}</div>

  const heightContainer = props.includeWindowHeightContainer ? (
    <WindowHeightContainer heightCompensation={90} useWhenDesktop allowOverflow={props.allowOverflow}>
      {content}
    </WindowHeightContainer>
  ) : (
    content
  )

  const goHome = goTo('home')
  const goToSwap = goTo('swap')

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isSidebarOpen,
        })}
      >
        <Toolbar className={classes.toolbarHeader}>
          <div onClick={goHome}>
            <img src="/imgs/logo_plain.png" alt="logo_header" className={classes.appBarHeaderLogo} />
          </div>
          <div className={classes.middleLogo} onClick={goHome}>
            <img src="/imgs/logo_word.png" alt="logo_text" />
          </div>
          <div onClick={goToSwap} className={classes.swapButton}>
            Swap
          </div>
          <AvatarMenu />
        </Toolbar>
      </AppBar>
      <main className={`${classes.content} ${props.noPadding ? classes.noPadding : ''}`}>
        <div className={classes.toolbar} />
        {heightContainer}
      </main>
    </div>
  )
}

export default SidebarLayout

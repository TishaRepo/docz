/** @jsx jsx */
import * as React from 'react'
import { jsx, Box, Flex, useColorMode } from 'theme-ui'
import { useConfig, useCurrentDoc } from 'docz'

import * as styles from './styles'
import { Edit, Menu, Sun, Github, HowDoI } from '../Icons'
import { Logo } from '../Logo'
import Window from '../Window'
/**
 * @function Header
 * @param {object} props Onopen Function as parameter
 * @returns {DocumentAndElementEventHandlers}
 */
export const Header = props => {
  const [open, setOpen] = React.useState(false)
  const { onOpen } = props
  const {
    repository,
    themeConfig: { showDarkModeSwitch, showMarkdownEditButton },
  } = useConfig()
  const { edit = true, ...doc } = useCurrentDoc()
  const [colorMode, setColorMode] = useColorMode()

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light')
  }
/**
 * @method openHowDoIWindow  Sets open variable value as true
 * @returns {void}
 */
  const openHowDoIWindow = () => {
    setOpen(true)
  }
  /**
   * @method closeHowDoIWindow  Sets open variable value as false
   * @returns {void}
   */
  const closeHowDoIWindow = () => {
    setOpen(false)
  }

  return (
    <div sx={styles.wrapper} data-testid="header">
      <Box sx={styles.menuIcon}>
        <button sx={styles.menuButton} onClick={onOpen}>
          <Menu size={25} />
        </button>
      </Box>
      <div sx={styles.innerContainer}>
        <Logo />
        <Flex>
          {repository && (
            <Box sx={{ mr: 2 }}>
              <a
                href={repository}
                sx={styles.headerButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} />
              </a>
            </Box>
          )}
          {showDarkModeSwitch && (
            <button
              sx={styles.headerButton}
              onClick={toggleColorMode}
              aria-label={`Switch to ${colorMode} mode`}
            >
              <Sun size={15} />
            </button>
          )}
          {
            <button
              sx={styles.headerButton}
              onClick={openHowDoIWindow}
              aria-label={`Switch to ${colorMode} mode`}
            >
              <HowDoI size={15} />
            </button>
          }
          {<Window open={open} close={closeHowDoIWindow} text="Window" />}
        </Flex>
        {showMarkdownEditButton && edit && doc.link && (
          <a
            sx={styles.editButton}
            href={doc.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Edit width={14} />
            <Box sx={{ pl: 2 }}>Edit page</Box>
          </a>
        )}
      </div>
    </div>
  )
}

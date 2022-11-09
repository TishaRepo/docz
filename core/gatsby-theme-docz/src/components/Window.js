import React, { useState } from 'react'
import { ReactDialogBox } from 'react-js-dialog-box'
import { useMenus, useDocs } from 'docz'
import { get } from 'lodash/fp'
import 'react-js-dialog-box/dist/index.css'
import { Box } from 'theme-ui'

/**
 * @function getHeadings
 * @param {string} route
 * @param {Array} docs Array containing all elements of menu
 * @returns {Array} 
 */
const getHeadings = (route, docs) => {
  const doc = docs.find(doc => doc.route === route)
  const headings = get('headings', doc)
  return headings ? headings.filter(heading => heading.depth === 2) : []
}

/**
 *
 * @param {object} props Has two values open which has type boolean and close which is a function
 * @returns {Window}
 */
export default function Window(props) {
  const menus = useMenus({})
  var LUpdatedList = []

  /**
   * @function addHeadings
   * @param {Array} p_arrHeadings Array containing all elements of menu
   * @param {String} p_strRout
   */
  //Add Headers in the how do I dialogs
  const addHeadings = (p_arrHeadings, p_strRout) => {
    for (let Heading of p_arrHeadings) {
      if (Heading.depth > 1) {
        let obj = {
          name: Heading.value,
          route: p_strRout + '#' + Heading.slug,
          key: LUpdatedList.length + '_' + Heading.value,
          isExternalLink: false,
        }
        LUpdatedList.push(obj)
      }
    }
  }
  /**
   * @function createHowDoIList
   * @param {Array} p_arrMenus Array containing all elements of menu
   */
  //Add Actions in the how do i dialog
  const createHowDoIList = p_arrMenus => {
    for (let Item of p_arrMenus) {
      if (Item.menu) {
        createHowDoIList(Item.menu, '')
      }

      if (Item.route) {
        let obj = {
          name: Item.name,
          route: Item.route,
          key: LUpdatedList.length + '_' + Item.name,
          isExternalLink: false,
        }

        LUpdatedList.push(obj)

        if (Item.headings && Item.headings.length > 0) {
          const docs = useDocs()
          const headings = getHeadings(Item.route, docs)
          addHeadings(headings, Item.route)
        }
      }
    }
  }
  /**
   * @function addExternalPageLinks Adds all links in the current page which routes to another page
   */
  //Add Externals links
  const addExternalPageLinks = () => {
    var LAllPageLinks = document.getElementsByTagName('a')

    if (LAllPageLinks && LAllPageLinks.length > 0) {
      for (let link of LAllPageLinks) {
        if (link === undefined) {
          continue
        }
        let LHref = link.href
        //Do not add navigation action link
        if (
          LHref.startsWith(window.location.origin) ||
          link.textContent.trim() === ''
        ) {
          continue
        }

        let obj = {
          name: link.textContent,
          route: LHref,
          key: LUpdatedList.length + '_' + link.textContent,
          isExternalLink: true,
        }

        LUpdatedList.push(obj)
      }
    }
  }

  createHowDoIList(menus, '')

  addExternalPageLinks()
  /**
   * @function handlOnButtonClicked
   * @param {String} p_rout
   * @param {Boolean} p_boolIsExternalLink Checks if the link routes to another window
   */
  //When user click on the links
  const handlOnButtonClicked = (p_rout, p_boolIsExternalLink) => {
    if (p_boolIsExternalLink) {
      window.open(p_rout)
    } else {
      window.open(window.location.origin + p_rout, '_self')
    }
  }

  return (
    <>
      {props.open && (
        <Box>
          <ReactDialogBox
            closeBox={props.close}
            modalWidth="20%"
            headerBackgroundColor="blue"
            headerTextColor="white"
            headerHeight="60px"
            closeButtonColor="white"
            bodyBackgroundColor="white"
            bodyTextColor="black"
            // bodyHeight="150px"
            headerText="How Do I ?"
          >
            <div>
              <table>
                {LUpdatedList &&
                  LUpdatedList.map(item => {
                    return (
                      <tr>
                        <button
                          key={item.key}
                          onClick={() =>
                            handlOnButtonClicked(
                              item.route,
                              item.isExternalLink
                            )
                          }
                        >
                          {item.name}
                        </button>
                      </tr>
                    )
                  })}
              </table>
            </div>
          </ReactDialogBox>
        </Box>
      )}
    </>
  )
}

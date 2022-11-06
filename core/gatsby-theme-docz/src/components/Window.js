import React, { useState } from 'react'
import { ReactDialogBox } from 'react-js-dialog-box'
import { useMenus, useDocs } from 'docz'
import { get } from 'lodash/fp'
import 'react-js-dialog-box/dist/index.css'

const getHeadings = (route, docs) => {
  const doc = docs.find(doc => doc.route === route)
  const headings = get('headings', doc)
  return headings ? headings.filter(heading => heading.depth === 2) : []
}

export default function Window(props) {
  const menus = useMenus({})
  console.log(menus)
  var LUpdatedList = []

  //Add Headers in the how do I dilaogs
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
        if (LHref.startsWith(window.location.origin) || link.textContent.trim() === "") {
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

  //When user click on the links
  const handlOnButtonClicked = (p_rout, p_boolIsExternalLink) => {
    console.log(p_rout)
    if (p_boolIsExternalLink) {
      window.open(p_rout)
    } else {
      window.open(window.location.origin + p_rout, '_self')
    }
  }

  return (
    <>
      {props.open && (
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
      )}
    </>
  )
}

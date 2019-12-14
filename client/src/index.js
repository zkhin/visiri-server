import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { MarkupContextProvider } from './contexts/MarkupContext'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { ThingListProvider } from './contexts/ThingListContext'
// import { ThingProvider } from './contexts/ThingContext'
import App from './components/App/App'
import './index.css'

// import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

// import {
//   faBookOpen,
//   faComment,
//   faGift,
//   faGlobeAmericas,
//   faListOl,
//   faListUl,
//   faPenAlt,
//   faQuoteLeft,
//   faStar as fasStar,
// } from '@fortawesome/free-solid-svg-icons'

// library.add(
//   faGift, // logo
//   faListUl, // style: listicle
//   faListOl, // style: howto
//   faGlobeAmericas, // style: news
//   faPenAlt, // style: interview
//   faBookOpen, // style: story
//   faComment,
//   faQuoteLeft,
//   farStar,
//   fasStar,
// )
// window.addEventListener(
//   "touchmove",
//   function (event) {
//     if (event.scale !== 1) {
//       event.preventDefault();
//     }
//   },
//   { passive: false }
// );
ReactDOM.render(
  <BrowserRouter>
    <MarkupContextProvider>
        <App />
    </MarkupContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
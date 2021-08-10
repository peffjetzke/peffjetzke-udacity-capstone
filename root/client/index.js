/*Imports*/
import { generatePage } from './js/app'
import { resetPage } from './js/app'

/*CSS*/
import './styles/style.scss'
import './styles/small.scss'
import './styles/medium.scss'
import './styles/large.scss'

/*Submit event handler*/
document.querySelector("form").addEventListener("submit", generatePage);
document.getElementById("reset").addEventListener("click", resetPage);

/*Export the imports to pass along*/
export {generatePage, resetPage}
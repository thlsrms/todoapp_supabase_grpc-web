import { Link } from '@solidjs/router'
import { useGlobalContext } from '../context/global';

export default function Navbar() {
  const { theme, setTheme } = useGlobalContext();

  function toggleDarkMode() {
    theme() === 'dark' ? setTheme('light') : setTheme('dark')
  }

  return (
    <nav class='uk-flex uk-flex-center'>
      <ul class='uk-flex uk-flex-row uk-flex-around uk-width-xlarge'>
        <li><Link href='/'>Home</Link></li>
        <li><Link href='/tasks'>Tasks</Link></li>
        <li><Link href='/about'>About</Link></li>
        <li><Link href='/signup'>Signup</Link></li>
        <li><Link href='/error'>Error</Link></li>
        <li>
          <button class={
            `${theme() === 'light' ? 'i-mdi-moon-waxing-crescent' : 'i-mdi-white-balance-sunny'}
                w-10 h-5 uk-button uk-button-small`
          }
            onClick={() => toggleDarkMode()}
          ></button>
        </li>
      </ul>
    </nav>
  );
};

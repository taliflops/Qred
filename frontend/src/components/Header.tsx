import { Logo, OpenMenu } from '../assets/icons';

export function Header() {
  return (
    <header className="header">
      <Logo />
      <button type="button" className="icon-button" aria-label="Open menu">
        <OpenMenu />
      </button>
    </header>
  );
}

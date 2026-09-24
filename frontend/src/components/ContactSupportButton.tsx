import { ContactSupport } from '../assets/icons';

// Navigation to the contact support page is out of scope; only the button is shown.
export function ContactSupportButton() {
  return (
    <button type="button" className="icon-button contact-support" aria-label="Contact support">
      <ContactSupport />
    </button>
  );
}

import { Mail, Phone, MapPin, Utensils, Handshake, Scale, UserPlus, LogOut } from 'lucide-react';
import Button from '../../../components/Button/Button';
import { useLogout } from '../../../hooks/HR/useLogout';
import styles from './Settings.module.scss';
import { Link } from 'react-router-dom';

export default function Settings() {
  const { logout } = useLogout();

  return (
    <div className={`${styles.settings_container} space-y-4`}>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Rserv</h1>
      </div>

      <SettingRow title="Restaurant Name">
        <div className="flex flex-row items-center gap-4">
          <Utensils size={16} />
          <p>Maison de Lumiere</p>
        </div>
      </SettingRow>

      <SettingRow title="Restaurant Address">
        <div className="flex flex-row items-center gap-4">
          <MapPin size={16} />
          <p>1234 Culinary Street, Foodie City, FC 56789</p>
        </div>
      </SettingRow>

      <SettingRow title="Contact">
        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center gap-4">
            <Mail size={16} />
            <p>maisondelumiere@gmail.com</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Phone size={16} />
            <p>+65 1234 5678</p>
          </div>
        </div>
      </SettingRow>

      <SettingRow title="Add Admin">
        <div className="flex flex-row items-center gap-4">
          <UserPlus size={20} />
          <p className="text-sm text-gray-600">
            Add a new administrator with access to manage restaurant settings and reservations.
          </p>
        </div>
        <div className={styles.setting_button}>
          <Link to={'/adm/settings/add-admin'}>Add Admin</Link>
        </div>
      </SettingRow>

      <SettingRow title="Legal Terms">
        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center gap-4">
            <Handshake size={20} />
            <p className="text-sm text-gray-600 ">
              Review the platform’s usage terms applicable to administrators and staff.
            </p>
          </div>
          <div className={`${styles.setting_button} mb-3`}>
            <a href="/?modal=terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
          </div>

          <div className="flex flex-row items-center gap-4">
            <Scale size={20} />
            <p className="text-sm text-gray-600">
              View data privacy practices relevant to customer and admin information.
            </p>
          </div>
          <div className={styles.setting_button}>
            <a href="/?modal=privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>
        </div>
      </SettingRow>

      <SettingRow title="Logout">
        <div className="flex flex-row items-center gap-4">
          <LogOut size={16} />
          <Button onClick={logout} className={styles.logout__button}>
            Logout
          </Button>
        </div>
      </SettingRow>
    </div>
  );
}

function SettingRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 border border-gray-200 shadow-md rounded-2xl max-w-3xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch">
        {/* Left side (Title) */}
        <div className="sm:w-[30%] w-full flex sm:justify-end items-center">
          <span className="text-gray-700 font-medium whitespace-nowrap">{title}</span>
        </div>

        {/* Divider for sm+ screens only */}
        <div className="hidden sm:block w-px bg-gray-300" />

        {/* Right side (Content) */}
        <div className="flex-1 pl-0 sm:pl-4">{children}</div>
      </div>
    </div>
  );
}

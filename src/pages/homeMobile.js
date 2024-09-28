import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faBell, faGrip, faHome, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const HomeMobile = ({ username, roleId, handleLogout, GetNamaDivisi }) => {
  const navigate = useNavigate();
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const id_user = localStorage.getItem("userId");
    if (id_user) {
      fetch(`${apiUrl}/notif/user/${id_user}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data notifikasi");
          }
          return response.json();
        })
        .then((data) => {
          const unreadNotifications = data.data.some((notif) => notif.is_read === 0);
          setHasNewNotifications(unreadNotifications);
        })
        .catch((error) => console.error("Error fetching notifications:", error))
        .finally(() => setLoading(false)); // Set loading to false after fetch
    }
    // Cleanup function (if needed)
    return () => {
      setLoading(false); // Optional: Reset loading on unmount
    };
  }, [apiUrl]);

  const handleNotificationClick = () => {
    navigate("/notification");
    setHasNewNotifications(false);
  };

  const TitleDivider = ({ title, onClick }) => (
    <div className="flex justify-between p-4">
      <div className="font-bold">{title}</div>
      {onClick && (
        <div onClick={onClick} className="cursor-pointer">
          Lihat semua
        </div>
      )}
    </div>
  );

  const MenuBantuan = ({ icon, title, color, onClick }) => (
    <div className="flex flex-row items-center gap-2 p-4 bg-green-100 rounded-xl cursor-pointer" onClick={onClick}>
      <FontAwesomeIcon className={color} icon={icon} />
      <span>{title}</span>
    </div>
  );

  const IconButton = ({ icon, label, onClick, color, hasNotification, isTop }) => (
    <button onClick={onClick} aria-label={label} className="p-4 relative icon-button-relative">
      <div className="flex flex-col items-center">
        <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
        <span className="mt-2 text-sm">{label}</span>
        {hasNotification && (
          <span
            className={`absolute ${isTop ? "top-3" : "bottom-3"} right-11 w-2 h-2 bg-red-500 rounded-full transform translate-x-1 ${
              isTop ? "-translate-y-1/2" : "translate-y-1/2"
            } animate-pulse`}
          ></span>
        )}
      </div>
    </button>
  );

  return (
    <div className="flex flex-col font-sans">
      <div className="bg-green-900 rounded-b-2xl p-9 relative">
        <button onClick={handleLogout} className="absolute top-5 right-5 text-lg text-white hover:text-gray-300">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
        <div className="flex flex-col py-5">
          <h2 className="text-xs font-bold text-white mb-0 pb-0">Selamat Datang,</h2>
          <div className="text-3xl font-semibold text-white mb-3">{username || "User"}</div>
          <div className="text-xs text-white font-semibold">{GetNamaDivisi(roleId)} • Kantor Palem</div>
        </div>
      </div>
      <TitleDivider title="Menu" />
      <div className="grid grid-cols-3 gap-4">
        <IconButton icon={faCalendarCheck} label="Absensi" onClick={() => navigate("/absensi")} color="text-blue-500" />
        <IconButton
          icon={faBell}
          label="Notifikasi"
          onClick={handleNotificationClick}
          color="text-yellow-500"
          hasNotification={hasNewNotifications}
          isTop={true} // Titik notifikasi di atas
        />
        <IconButton icon={faGrip} label="Lainnya" onClick={() => navigate("/menu")} color="text-gray-500" />
      </div>
      <TitleDivider title="Bantuan" />
      <div className="flex flex-col gap-2 px-5">
        <MenuBantuan
          color="text-green-500"
          icon={faWhatsapp}
          title="Team IT"
          onClick={() => window.open("https://wa.me/628980128222", "_blank")}
        />
        <MenuBantuan
          color="text-green-500"
          icon={faWhatsapp}
          title="Team Leader"
          onClick={() => window.open("https://wa.me/6287819999599", "_blank")}
        />
      </div>
      <div className="fixed bottom-0 left-0 w-full flex justify-around bg-green-900 shadow-md text-white">
        <IconButton icon={faHome} label="Home" onClick={() => navigate("/home")} />
        <IconButton
          icon={faBell}
          label="Notifikasi"
          onClick={handleNotificationClick}
          />
        <IconButton icon={faUser} label="Profil" onClick={() => navigate("/profile")} />
      </div>
    </div>
  );
};

export default HomeMobile;

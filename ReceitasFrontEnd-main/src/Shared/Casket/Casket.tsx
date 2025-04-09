import { Menu } from "primereact/menu";
import { Link, Outlet, Routes, useLocation, useNavigate } from "react-router-dom";
import Rotas from "../../Routes/routes";
import './Casket.css';
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
import { Button } from "primereact/button";
import { Sidebar } from 'primereact/sidebar';

interface DecodedToken {
    name: string;
    cargo: string;
}

interface MenuItem {
    label: string;
    icon: string;
    command: () => void;
    navigable: boolean;
    items?: MenuItem[];
  }

export function Casket({ children }: { children?: any }) {
    const [userName, setUserName] = useState('User');
    const [cargoName, setCargoName] = useState('');
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState<MenuItem | null>(null);
    const [items, setItems] = useState<MenuItem[]>([]);

    const navigateMenu = (url: string) => {
        navigate(url);
        setShowMenu(false);
    }
    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
            setUserName(decoded.name);
            setCargoName(decoded.cargo.toLowerCase());
        } else {
            navigate('/');
        }
    }, [navigate]);

    const location = useLocation();
    useEffect(() => {
        const getMenuItemsByRole = (role: string): MenuItem[] => {
          switch (role) {
            case 'admin':
              return [
                { label: 'Dashboard', icon: 'pi pi-home', command: () => { navigateMenu('dashboard') }, navigable: true },
                { label: 'Cadastrar restaurante', icon: 'pi pi-shopping-bag', command: () => { navigateMenu('restaurante') }, navigable: true },
                {
                  label: 'Receitas', icon: 'pi pi-list', command: () => { }, navigable: false, items: [
                    { label: 'Criar', icon: 'pi pi-plus', command: () => { navigateMenu('criarReceita') }, navigable: true },
                    { label: 'Avaliar', icon: 'pi pi-check', command: () => { navigateMenu('avaliarReceita') }, navigable: true },
                    { label: 'Criar ingrediente', icon: 'pi pi-plus', command: () => { navigateMenu('criarIngredientes') }, navigable: true },
                    { label: 'Criar categoria', icon: 'pi pi-plus', command: () => { navigateMenu('categoria') }, navigable: true },
                    { label: 'Criar medida', icon: 'pi pi-plus', command: () => { navigateMenu('medida') }, navigable: true },
                  ]
                },
                {
                  label: 'Funcionário', icon: 'pi pi-users', command: () => { }, navigable: false, items: [
                    { label: 'Cadastrar funcionário', icon: 'pi pi-user-plus', command: () => { navigateMenu('funcionario') }, navigable: true },
                    { label: 'Cadastrar cargo', icon: 'pi pi-user-plus', command: () => { navigateMenu('cargo') }, navigable: true },
                    { label: 'Cadastrar referência', icon: 'pi pi-user-plus', command: () => { navigateMenu('referencia') }, navigable: true },
                  ]
                },
                {
                  label: 'Editor', icon: 'pi pi-book', command: () => { }, navigable: false, items: [
                    { label: 'Livro', icon: 'pi pi-plus', command: () => { navigateMenu('livro') }, navigable: true },
                    { label: 'Publicação', icon: 'pi pi-plus', command: () => { navigateMenu('publicacao') }, navigable: true },
                  ]
                },
              ];
            case 'cozinheiro':
              return [
                { label: 'Dashboard', icon: 'pi pi-home', command: () => { navigateMenu('dashboard') }, navigable: true },
                {
                  label: 'Receitas', icon: 'pi pi-list', command: () => { }, navigable: false, items: [
                    { label: 'Criar', icon: 'pi pi-plus', command: () => { navigateMenu('criarReceita') }, navigable: true },
                    { label: 'Criar ingrediente', icon: 'pi pi-plus', command: () => { navigateMenu('criarIngredientes') }, navigable: true },
                    { label: 'Criar categoria', icon: 'pi pi-plus', command: () => { navigateMenu('categoria') }, navigable: true },
                    { label: 'Criar medida', icon: 'pi pi-plus', command: () => { navigateMenu('medida') }, navigable: true },
                  ]
                },
              ];
            case 'degustador':
              return [
                { label: 'Dashboard', icon: 'pi pi-home', command: () => { navigateMenu('dashboard') }, navigable: true },
                { label: 'Avaliar', icon: 'pi pi-check', command: () => { navigateMenu('avaliarReceita') }, navigable: true },
              ];
            default:
              return [];
          }
        };
    
        setItems(getMenuItemsByRole(cargoName));
      }, [cargoName]);
    return (
        <div className="casket-container">

            <div className="A">
                {/* <div className="margin"></div> */}
                <div className="topbar">
                    <div style={{ width: '10%', marginLeft: 20 }}>
                        <Button icon="pi pi-bars" outlined onClick={() => setShowMenu(!showMenu)}></Button>
                    </div>
                    <ul>
                        <Avatar label={cargoName.substring(0, 1).toUpperCase()} style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} />
                        <li key={userName}>
                            <span>{userName.toUpperCase()} ({cargoName.toUpperCase()})</span>
                        </li>
                        <li>
                            <span style={{ cursor: "pointer" }} onClick={() => {
                                navigate('/');
                                sessionStorage.removeItem('access_token');
                                sessionStorage.removeItem('refresh_token');
                            }
                            }>Sair</span>
                            {/* <Link to={`/login`}><span>Sair</span></Link> */}
                        </li>
                    </ul>
                </div>
            </div>
            <div className="column-order">

                <Sidebar visible={showMenu} onHide={() => { setShowMenu(false) }} style={{ backgroundColor: '#2b2b2b' }}>
                <div className="logo">
            <img width={250} height={250} src="/img/pelegoLogo.svg"></img>
            {/* <SVGLogo fill="#2B2B2B" width={250} height={250} /> */}
          </div>
                    <div style={{ width: '100%', backgroundColor: '#2b2b2b' }}>
                        <div style={{ height: '100px' }}></div>
                        {items.map((menuItem, index) => {
                            return <div key={index}>
                                <div className="menu-item" key={index} style={{ cursor: menuItem.navigable ? 'pointer' : 'auto' }} onClick={() => {
                                    setActiveMenuItem(menuItem);
                                    menuItem?.command!()
                                }}>
                                    <div className="menu-item-display" style={{ color: activeMenuItem?.label === menuItem.label ? '#fff' : '#d2d2d2', fontWeight: activeMenuItem?.label === menuItem.label ? 'bolder' : 'normal' }}>
                                        <a className={menuItem.icon} style={{ marginLeft: 15 }}></a>
                                        <span style={{ marginLeft: 10, fontSize: '14px' }}>{menuItem.label}</span>
                                    </div>
                                </div>
                                {menuItem?.items?.map((subItem, index) => {
                                    return <div key={index} className="submenu-item" onClick={() => {
                                        setActiveMenuItem(menuItem);
                                        subItem.command!();
                                    }}>
                                        <div className="submenu-item-display">
                                            <a className={subItem.icon} style={{ marginLeft: 15 }}></a>
                                            <span style={{ marginLeft: 10, fontSize: '14px' }}>{subItem.label}</span>
                                        </div>

                                    </div>
                                })}
                            </div>
                        })}

                    </div>
                </Sidebar>

                <div className="main-content">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>

    )
}
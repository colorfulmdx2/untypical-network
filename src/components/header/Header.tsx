import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {Avatar, Button, ButtonGroup, Fab, FormControlLabel, Grow, Menu, MenuItem, Switch} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {NavLink, useHistory} from "react-router-dom";
import {AppStateType} from "../../redux/store";
import {login, logOut, setDarkMod, setLanguage} from '../../redux/reducer'
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Alert from '@material-ui/lab/Alert';
import {blue, grey} from "@material-ui/core/colors";
import {AddUserModal} from "../modal/AddUserModal";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        title: {},

        sectionDesktop: {
            display: 'flex',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',

            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {},
        },
        fabButton: {
            position: 'absolute',
            zIndex: 1,
            bottom: -45,
            left: 0,
            right: 0,
            margin: '0 auto',

        },
        alert: {
            position: 'absolute',
            top: 150,
            left: 0,
            right: 0,
            margin: '0 auto',
            width: 320,
            zIndex: 100
        },
        selected: {
            color: blue[500],
            backgroundColor: grey[900]
        },
        buttons: {
            position: 'absolute',
            bottom: -50,
            left: 6
        }
    }),
);

export const Header = React.memo(() => {

    const [open, setOpen] = useState(false)


    const handleModalClose = () => {
        setOpen(false);
    };
    const handleModalOpen = () => {
        setOpen(true);
    };

    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (e: any) => {
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const dispatch = useDispatch()


    const darkMode = useSelector<AppStateType, boolean>(state => state.reducer.darkMode)

    const darkModeOnChange = () => {
        dispatch(setDarkMod({value: !darkMode}))
    }

    const classes = useStyles();

    const {favorites, user, auth, lang, languagePackage} = useSelector<AppStateType, any>(state => state.reducer)

    const [info, setInfo] = useState(false)

    const addUserHandler = () => {
        if (!auth) {
            setInfo(true)
        } else {
            handleModalOpen()
        }
    }



    return (
        <Grow in={true}>
            <div className={classes.grow}>
                <Grow in={info}>
                    <Alert className={classes.alert}
                           severity="info"
                           onClose={() => setInfo(false)}
                    >{languagePackage[lang].notification}</Alert>
                </Grow>

                <AddUserModal isOpen={open}
                              handleClose={handleModalClose}
                              handleOpen={handleModalOpen}
                />

                <AppBar position="static">
                    <Toolbar>

                        <Typography className={classes.title} variant="h6" noWrap>
                            Users
                        </Typography>

                        <ButtonGroup className={classes.buttons} variant="text" color="primary"
                                     aria-label="text primary button group">
                            <Button className={lang === 'ru' ? classes.selected : ''}
                                    onClick={() => dispatch(setLanguage({value: 'ru'}))}>ru</Button>

                            <Button className={lang === 'en' ? classes.selected : ''}
                                    onClick={() => dispatch(setLanguage({value: 'en'}))}>en</Button>
                        </ButtonGroup>
                        <div className={classes.grow}/>
                        <Grow in={true}>
                            <Fab color="secondary"
                                 aria-label="add"
                                 className={classes.fabButton}
                                 onClick={addUserHandler}
                            >
                                <PersonAddIcon/>
                            </Fab>
                        </Grow>
                        <div className={classes.sectionDesktop}>

                            <FormControlLabel label={languagePackage[lang].darkMode}
                                              control={
                                                  <Switch checked={darkMode}
                                                          onChange={darkModeOnChange}
                                                          color={"secondary"}
                                                  />
                                              }
                            />


                            <NavLink to={'/favorites'}>
                                <IconButton color="secondary">
                                    <Badge badgeContent={Object.keys(favorites).length}
                                           color="secondary"
                                           anchorOrigin={{
                                               vertical: 'bottom',
                                               horizontal: 'right',
                                           }}
                                    >
                                        <FavoriteIcon/>
                                    </Badge>
                                </IconButton>
                            </NavLink>

                            {
                                user ? <div>
                                        <Avatar src={user.photoURL}
                                                onClick={handleClick}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    cursor: 'pointer',
                                                    margin: '9px 0px 0px 7px'
                                                }}/>
                                        <Menu
                                            style={{top: '45px'}}
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem
                                                onClick={() => dispatch(logOut())}>{languagePackage[lang].logOut}</MenuItem>
                                        </Menu>
                                    </div>
                                    : <Button
                                        onClick={() => dispatch(login())}
                                        startIcon={<PermIdentityIcon/>}
                                    >
                                        {languagePackage[lang].login}
                                    </Button>

                            }

                        </div>

                    </Toolbar>
                </AppBar>
            </div>
        </Grow>
    )
        ;
})

import React, {useState} from 'react';
import {createStyles, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {grey, indigo} from "@material-ui/core/colors";
import {addUser, UserType} from '../../redux/reducer';
import { v4 as uuidv4 } from 'uuid';

type AddUserModalType = {
    isOpen: boolean
    handleOpen: () => void
    handleClose: () => void
    user?: UserType
    id?: string
}


export const UserModal = React.memo((props: AddUserModalType) => {

    const {darkMode, lang, languagePackage} = useSelector<AppStateType, any>(state => state.reducer)

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            modal: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                "&:focus": {
                    outline: "none"
                }
            },
            form: {
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2, 4, 3),
                "&:focus": {
                    outline: "none"
                }
            },
            input: {
                margin: 10,
                '& label.Mui-focused': {
                    color: darkMode ? indigo[300] : grey[700],
                },
                '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: darkMode ? indigo[300] : grey[700]
                    },
                },
            }
        }),
    );

    const AddButton = withStyles({
        root: {
            margin: 10,
            '& label.Mui-focused': {
                color: darkMode ? indigo[300] : grey[700],
            },
            '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                    borderColor: darkMode ? indigo[300] : grey[700]
                },
            },
        }
    })
    (Button)


    const classes = useStyles()
    const dispatch = useDispatch()

    const [email, setEmail] = useState(props.user ? props.user.email: '')
    const [emailError, setEmailError] = useState(false)

    const [name, setName] = useState(props.user ? props.user.name: '')
    const [sex, setSex] = useState('male')

    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value)
        setEmailError(false)
    }
    const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
    }

    const sexHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
        setSex(e.target.value as string)
    }

    const AddUserHandler = () => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            setEmailError(true)
        } else {
            dispatch(addUser({
                email: email,
                name: name,
                sex: sex,
                id: props.user ? props.user.id : uuidv4()
            }))
            props.handleClose()
            setName('')
            setEmail('')
        }
    }
    return (
        <div style={{boxSizing: 'border-box'}}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.isOpen}
                onClose={props.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >

                <form className={classes.form}
                >
                    <TextField error={emailError}
                               className={classes.input}
                               label={languagePackage[lang].email}
                               helperText={emailError ? languagePackage[lang].invalidEmail : ''}
                               variant="outlined"
                               color={'primary'}
                               value={email}
                               onChange={emailHandler}

                    />
                    <TextField error={false}
                               className={classes.input}
                               label={languagePackage[lang].name}
                               helperText={''}
                               variant="outlined"
                               color={'secondary'}
                               value={name}
                               onChange={nameHandler}
                    />
                    <FormControl>
                        <InputLabel id="demo-simple-select-required-label">{languagePackage[lang].sex}</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={sex}
                            defaultValue={sex}
                            onChange={sexHandler}
                        >
                            <MenuItem value={'male'}>{languagePackage[lang].male}</MenuItem>
                            <MenuItem value={'female'}>{languagePackage[lang].female}</MenuItem>
                        </Select>
                    </FormControl>
                    <AddButton onClick={AddUserHandler} variant="outlined">
                        {languagePackage[lang].go}
                    </AddButton>
                </form>

            </Modal>
        </div>
    );
})
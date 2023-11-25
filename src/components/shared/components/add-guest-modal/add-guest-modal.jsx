import React, {useState} from 'react';

function AddGuestModal({showModal, closeModal, guestPlayerSelected}) {

    React.useEffect(() => {
        console.log('show modal change', showModal);

        if (showModal) {
            $('#addGuestModal').modal('show');
        } else {
            $('#addGuestModal').modal('hide');
        }

    }, [showModal]);

    const [guestForm, setGuestForm] = useState({
        name: '',
        points: 0
    });

    const handleGuestForm = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        console.log('name ', name);
        console.log('value ', value);
        setGuestForm({
            ...guestForm,
            [name]: value
        })
    }

    const hideGuestModal = () => {
        console.log('hide guest modal')
    }

    const saveGuestModal = () => {
        console.log(guestForm);
        const guestPlayer = {
            name: guestForm.name + ' (INVITADO)',
            points: parseInt(guestForm.points)
        }
        closeModal(true);
        guestPlayerSelected(guestPlayer);
    }

    const handleCloseModal = () => {
        closeModal(true)
    }


    return (
        <>
        <div className="modal fade" id="addGuestModal" tabIndex="-1" aria-labelledby="addGuestModal" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Agregar invitado</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
                <form>
                    <label>Nombre</label>
                    <input type="text" name="name" className='form-control' onChange={handleGuestForm}/>
                    <label>Puntos totales</label>
                    <input type="number" name="points" className='form-control' onChange={handleGuestForm}/>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={saveGuestModal}>Save changes</button>
            </div>
            </div>
        </div>
    </div>
    </>
    )
}

export default AddGuestModal;
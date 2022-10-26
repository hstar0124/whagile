import { Button } from 'primereact/button';

function EmailItems({emails, setEmails}) {

    const removeEmail = (id) => {
        const removedList = emails.filter(email => email.id !== id);
        
        setEmails(removedList);
    }

    return (
        <>
            {
                emails.map(
                    email =>
                        email.address != '' &&
                        <p key={ email.id }>
                            <label 
                                htmlFor={ email.id } 
                            >
                                { email.address }
                            </label>
                            <Button icon="pi pi-times" iconPos="right" className="p-button-rounded p-button-danger" aria-label="Cancel" onClick={ () => removeEmail(email.id) } />    
                        </p>
                )
            }
        </>
    );
}

export default EmailItems;
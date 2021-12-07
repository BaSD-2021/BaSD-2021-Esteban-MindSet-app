/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useQuery from '../../../Hooks/useQuery';
import styles from './form.module.css';
import Input from '../../Shared/Input';
import Button from '../../Shared/Button';
import Select from '../../Shared/Select';

function Form() {
  const [professionalProfileIdValue, setProfessionalProfileIdValue] = useState('');
  const [clientIdValue, setClientIdValue] = useState('');
  const [vacancyValue, setVacancyValue] = useState('');
  const [jobDescriptionValue, setJobDescriptionValue] = useState('');
  const [isOpenValue, setIsOpenValue] = useState('');
  const [clientsValue, setClientsValue] = useState([]);
  const [professionalProfilesValue, setProfessionalProfilesValue] = useState([]);
  const [selectClient, setSelectClient] = useState([]);
  const [selectProfessionalProfile, setSelectProfessionalProfile] = useState([]);
  const [errorValue, setError] = useState('');
  const query = useQuery();
  const history = useHistory();

  let fetchMethod = 'POST';

  const onLoading = (dat) => {
    setProfessionalProfileIdValue(
      dat.data[0].professionalProfile ? dat.data[0].professionalProfile : ''
    );
    setClientIdValue(dat.data[0].client ? dat.data[0].client._id : '');
    setVacancyValue(dat.data[0].vacancy || '');
    setJobDescriptionValue(dat.data[0].jobDescription || '');
    setIsOpenValue(dat.data[0].isOpen || '');
  };

  const onChangeProfessionalProfileId = (event) => {
    setProfessionalProfileIdValue(event.target.value);
  };

  const onChangeClientId = (event) => {
    setClientIdValue(event.target.value);
  };

  const onChangeVacancy = (event) => {
    setVacancyValue(event.target.value);
  };

  const onChangeJobDescription = (event) => {
    setJobDescriptionValue(event.target.value);
  };

  const onChangeIsOpen = (event) => {
    setIsOpenValue(event.target.value);
  };

  const positionId = query.get('_id');
  const url1 = `${process.env.REACT_APP_API}/positions?_id=${positionId}`;

  if (positionId) {
    fetchMethod = 'PUT';
  }

  const onSubmit = (event) => {
    event.preventDefault();

    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client: clientIdValue,
        jobDescription: jobDescriptionValue,
        vacancy: vacancyValue,
        professionalProfile: professionalProfileIdValue,
        isOpen: isOpenValue
      }),
      method: fetchMethod
    };

    const url = positionId
      ? `${process.env.REACT_APP_API}/positions/${positionId}`
      : `${process.env.REACT_APP_API}/positions/`;

    fetch(url, options)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then(() => {
        history.push(`/positions`);
      })
      .catch((errorValue) => {
        setError(errorValue.toString());
      });
  };
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/profiles`)
      .then((response) => response.json())
      .then((res) => {
        setSelectProfessionalProfile(
          res.data.map((proffesionalprofile) => ({
            value: proffesionalprofile._id,
            label: proffesionalprofile.name
          }))
        );
        setProfessionalProfilesValue(res.data);
      })
      .catch((errorValue) => {
        setError(errorValue.toString());
      });

    fetch(`${process.env.REACT_APP_API}/clients`)
      .then((response) => response.json())
      .then((res) => {
        setSelectClient(
          res.data.map((client) => ({
            value: client._id,
            label: client.name
          }))
        );
        setClientsValue(res.data);
      })
      .catch((errorValue) => {
        setError(errorValue.toString());
      });

    if (positionId) {
      fetch(url1)
        .then((response) => response.json())
        .then((res) => {
          onLoading(res);
        })
        .catch((errorValue) => {
          setError(errorValue.toString());
        });
    }
  }, []);
  return (
    <div>
      <form onSubmit={onSubmit} className={styles.container}>
        <h2 className={styles.title}>Form</h2>
        <Select
          title="Client Name"
          id="clientId"
          name="clientId"
          value={clientIdValue}
          onChange={onChangeClientId}
          arrayToMap={selectClient}
          required
        />
        <Input
          title="Job Description"
          id="jobDescription"
          name="jobDescription"
          type="text"
          value={jobDescriptionValue}
          onChange={onChangeJobDescription}
          required
        />
        <Input
          title="Vacancy"
          id="vacancy"
          name="vacancy"
          type="number"
          value={vacancyValue}
          onChange={onChangeVacancy}
          required
        />
        <Select
          title="Professional Profile"
          id="professionalProfileId"
          name="professionalProfileId"
          value={professionalProfileIdValue}
          onChange={onChangeProfessionalProfileId}
          arrayToMap={selectProfessionalProfile}
          required
        />
        <Select
          title="Is Open"
          id="isOpen"
          name="isOpen"
          value={isOpenValue}
          onChange={onChangeIsOpen}
          arrayToMap={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' }
          ]}
          required
        />
        <Button name="saveButton" />
        <div className={styles.error}>{errorValue}</div>
      </form>
    </div>
  );
}

export default Form;

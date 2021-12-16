import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useQuery from '../../../Hooks/useQuery';
import styles from './form.module.css';
import Input from '../../Shared/Input';
import Button from '../../Shared/Button';
import Select from '../../Shared/Select';
import Modal from '../../Shared/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getApplicationById,
  createApplication,
  updateApplication
} from '../../../redux/applications/thunks';
import { cleanError, cleanSelectedItem } from '../../../redux/applications/actions';

function applicationForm() {
  const [positionId, setPositionId] = useState('');
  const [postulantId, setPostulantId] = useState('');
  const [date, setDate] = useState('');
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectPosition, setSelectPosition] = useState([]);
  const [selectPostulant, setSelectPostulant] = useState([]);
  const [selectInterviewDate, setSelectInterviewDate] = useState([]);
  const query = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedApplication = useSelector((store) => store.applications.selectedItem);
  const error = useSelector((store) => store.applications.error);

  const onChangePositionId = (event) => {
    setPositionId(event.target.value);
  };
  const onChangePostulantId = (event) => {
    setPostulantId(event.target.value);
  };
  const onChangeDate = (event) => {
    setDate(event.target.value);
  };
  const onChangeResult = (event) => {
    setResult(event.target.value);
  };

  useEffect(() => {
    if (Object.keys(selectedApplication).length) {
      setPositionId(selectedApplication.positions?._id);
      setPostulantId(selectedApplication.postulants?._id);
      setDate(selectedApplication.interview._id);
      setResult(selectedApplication.result);
    }
  }, [selectedApplication]);

  useEffect(() => {
    return () => {
      dispatch(cleanSelectedItem());
    };
  }, []);

  useEffect(() => {
    const applicationId = query.get('_id');
    if (applicationId) {
      dispatch(getApplicationById(applicationId));
    }
    fetch(`${process.env.REACT_APP_API}/positions`)
      .then((response) => {
        if (response.status !== 200) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then((res) => {
        setIsLoading(false);
        setSelectPosition(
          res.data.map((position) => ({
            value: position._id,
            label: position.jobDescription
          }))
        );
      })
      .catch((err) => {
        setErrorMessage(err.toString());
      });

    fetch(`${process.env.REACT_APP_API}/postulants`)
      .then((response) => {
        if (response.status !== 200) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then((res) => {
        setIsLoading(false);
        setSelectPostulant(
          res.data.map((postulant) => ({
            value: postulant._id,
            label: `${postulant.firstName} ${postulant.lastName}`
          }))
        );
      })
      .catch((err) => {
        setErrorMessage(err.toString());
      });

    fetch(`${process.env.REACT_APP_API}/interviews`)
      .then((response) => {
        if (response.status !== 200) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then((res) => {
        setIsLoading(false);
        setSelectInterviewDate(
          res.data.map((interview) => ({
            value: interview._id,
            label: interview.date
          }))
        );
      })
      .catch((err) => {
        setErrorMessage(err.toString());
      });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const applicationId = query.get('_id');

    const body = {
      positions: positionId,
      postulants: postulantId,
      interview: date,
      result: result
    };

    if (applicationId) {
      dispatch(updateApplication(applicationId, body)).then((response) => {
        if (response) {
          history.push('/applications');
        }
      });
    } else {
      dispatch(createApplication(body)).then((response) => {
        if (response) {
          history.push('/applications');
        }
      });
    }
  };

  return (
    <div className={styles.container}>
      <Modal
        show={!!error || !!errorMessage}
        title="Error"
        message={error || errorMessage}
        cancel={{
          text: 'Close',
          callback: () => {
            dispatch(cleanError());
            setErrorMessage(null);
          }
        }}
      />
      <form onSubmit={onSubmit} className={styles.container}>
        <h2 className={styles.title}>Applications</h2>
        <Select
          title="Position"
          id="positionId"
          name="positionId"
          value={positionId}
          onChange={onChangePositionId}
          arrayToMap={selectPosition}
          required
        />
        <Select
          title="Postulant"
          id="postulantId"
          name="postulantId"
          value={postulantId}
          onChange={onChangePostulantId}
          arrayToMap={selectPostulant}
          required
        />
        <Select
          title="Interview"
          id="interview"
          name="interview"
          value={date}
          onChange={onChangeDate}
          arrayToMap={selectInterviewDate}
          required
        />
        <Input
          title="Result"
          id="result"
          name="result"
          type="text"
          required
          value={result}
          onChange={onChangeResult}
          disabled={isLoading}
        />
        <div className={styles.buttonContainer}>
          <Button label="SAVE" disabled={isLoading} type="submit"></Button>
        </div>
      </form>
    </div>
  );
}

export default applicationForm;

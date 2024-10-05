import React, { useEffect, useState } from 'react';
import '../css/Explore.css';
import DisplayExploreResult from './DisplayExploreResult';

const Explore = (props) => {
  const { provider, web3, contract } = props.myWeb3Api;
  const account = props.account;

  const [explore, setExplore] = useState({
    state: "",
    district: "",
    city: "",
    surveyNo: ""
  });

  const [landDetail, setLandDetail] = useState({
    owner: "",
    propertyId: "",
    index: "",
    marketValue: "",
    sqft: ""
  });

  const [didIRequested, setDidIRequested] = useState(false);
  const [available, setAvailable] = useState(false);
  const [noResult, setNoResult] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  const onChangeFunc = (event) => {
    const { name, value } = event.target;
    setExplore({ ...explore, [name]: value });
  };

  const handleOnClick = async () => {
    // Check if the contract is initialized
    if (!contract) {
      console.error('Contract is not initialized');
      setNoResult(0); // Set noResult to indicate failure
      return; // Exit the function if contract is not available
    }

    try {
      // Fetch land details
      const landDetails = await contract.getLandDetails(
        explore.state,
        explore.district,
        explore.city,
        explore.surveyNo,
        { from: account }
      );

      // Check availability
      const isAvailable = await contract.isAvailable(
        explore.state,
        explore.district,
        explore.city,
        explore.surveyNo,
        { from: account }
      );

      // Extract land detail values
      const owner = landDetails[0];
      const propertyId = landDetails[1].words[0];
      const index = landDetails[2].words[0];
      const marketValue = landDetails[3].words[0];
      const sqft = landDetails[4].words[0];
      const surveyNo = explore.surveyNo;

      // Check ownership
      if (account === owner) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
        if (isAvailable) {
          const _didIRequested = await contract.didIRequested(
            explore.state,
            explore.district,
            explore.city,
            explore.surveyNo,
            { from: account }
          );
          setDidIRequested(_didIRequested);
        }
      }

      // Update state with land details
      setLandDetail({ owner, propertyId, index, marketValue, sqft, surveyNo });
      setAvailable(isAvailable);
      setNoResult(1); // Indicate success
    } catch (error) {
      console.error('Error fetching land details:', error);
      setNoResult(0); // Set noResult to indicate failure
    }
  };

  const requestForBuy = async () => {
    if (!contract) {
      console.error('Contract is not initialized');
      return; // Exit the function if contract is not available
    }

    try {
      await contract.RequestForBuy(
        explore.state,
        explore.district,
        explore.city,
        explore.surveyNo,
        { from: account }
      );

      setDidIRequested(true);
    } catch (error) {
      console.error('Error requesting to buy:', error);
    }
  };

  useEffect(() => {
    console.log(landDetail);
  }, [landDetail]);

  return (
    <div className='container explore-maindiv'>
      <div className='row'>
        <div className='col-12 col-sm-6'>
          <form method='POST' className='admin-form'>
            <div className='form-group'>
              <label>State</label>
              <input
                type="text"
                className="form-control"
                name="state"
                placeholder="Enter State"
                autoComplete="off"
                value={explore.state}
                onChange={onChangeFunc}
              />
            </div>
            <div className='form-group'>
              <label>District</label>
              <input
                type="text"
                className="form-control"
                name="district"
                placeholder="Enter district"
                autoComplete="off"
                value={explore.district}
                onChange={onChangeFunc}
              />
            </div>
          </form>
        </div>
        <div className='col-12 col-sm-6'>
          <form method='POST' className='admin-form'>
            <div className='form-group'>
              <label>City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                placeholder="Enter city"
                autoComplete="off"
                value={explore.city}
                onChange={onChangeFunc}
              />
            </div>
            <div className='form-group'>
              <label>Survey number</label>
              <input
                type="text"
                className="form-control"
                name="surveyNo"
                placeholder="Enter survey number"
                autoComplete="off"
                value={explore.surveyNo}
                onChange={onChangeFunc}
              />
            </div>
          </form>
        </div>
      </div>
      <button className='admin-form-btn' onClick={handleOnClick}>Explore</button>

      <DisplayExploreResult
        owner={landDetail.owner}
        propertyId={landDetail.propertyId}
        surveyNo={landDetail.surveyNo}
        marketValue={landDetail.marketValue}
        sqft={landDetail.sqft}
        available={available}
        isAdmin={props.isAdmin}
        didIRequested={didIRequested}
        requestForBuy={requestForBuy}
        noResult={noResult}
        isOwner={isOwner}
      />
    </div>
  );
};

export default Explore;

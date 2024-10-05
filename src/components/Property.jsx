import React, { useEffect, useState } from 'react';
import DisplayLandDetails from './DisplayLandDetails';

const Property = (props) => {
  const { provider, web3, contract } = props.myWeb3Api;
  const account = props.account;

  const [landDetailList, setLandDetailList] = useState([]);
  const [length, setLength] = useState(0);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const getProperty = async () => {
      // Check if contract is initialized
      if (!contract || !account) {
        console.error("Contract or account is not initialized");
        return;
      }

      try {
        // Get total indices from contract
        const _indices = await contract.methods.getIndices().call({ from: account });
        const _totalIndices = parseInt(_indices[0], 10);

        console.log('Total Indices:', _totalIndices); // Debugging log
        const detailsArr = [];

        for (let i = 0; i < _totalIndices; i++) {
          // Fetch property ownership details
          const ownerOwns = await contract.methods.getOwnerOwns(i).call({ from: account });
          console.log('Owner Owns:', ownerOwns); // Debugging log

          // If survey number is not 0
          if (parseInt(ownerOwns[3], 10) !== 0) {
            // Fetch land details for each property
            const landDetails = await contract.methods.getLandDetails(ownerOwns[0], ownerOwns[1], ownerOwns[2], ownerOwns[3]).call({ from: account });
            const isAvailable = await contract.methods.isAvailable(ownerOwns[0], ownerOwns[1], ownerOwns[2], ownerOwns[3]).call({ from: account });

            const landDetails2 = {
              state: ownerOwns[0],
              district: ownerOwns[1],
              city: ownerOwns[2],
              surveyNo: ownerOwns[3],
              isAvailable
            };

            detailsArr.push({ ...landDetails, ...landDetails2 });
          }
        }

        // Debugging log: Check if detailsArr is populated
        console.log('Land Details Array:', detailsArr);

        setLandDetailList(detailsArr);
        setLength(detailsArr.length);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    getProperty();
  }, [reload, contract, account]);

  const markAvailableFunction = async (indx) => {
    if (!contract || !account) {
      console.error("Contract or account is not initialized");
      return;
    }

    try {
      await contract.methods.markMyPropertyAvailable(indx).send({ from: account });
      setReload(!reload);
      console.log('Property marked available with index:', indx);
    } catch (error) {
      console.error('Error marking property available:', error);
    }
  };

  return (
    <div className='container' style={{ marginBottom: '2rem' }}>
      {length === 0 ? (
        <div className="no-result-div">
          <p className='no-result'>No properties found :(</p>
        </div>
      ) : (
        landDetailList.map((details, index) => (
          <DisplayLandDetails
            key={index}
            owner={details[0]}
            propertyId={details[1]}
            index={details[2]}
            marketValue={details[3]}
            sqft={details[4]}
            state={details.state}
            district={details.district}
            city={details.city}
            surveyNo={details.surveyNo}
            available={details.isAvailable}
            markAvailable={markAvailableFunction}
          />
        ))
      )}
    </div>
  );
};

export default Property;

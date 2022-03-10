import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PuffLoader } from 'react-spinners';



export default function App() {
  const [lines, setLines] = useState({});
  const [selectedLine, setSelectedLine] = useState([]);
  const [stopDetails, setStopDetails] = useState({})
  const [activeLineNr, setActiveLineNr] = useState("");
  const [sortedLines, setSortedLines] = useState([]);

  useEffect(() => {
    var temp;
    axios.get(`http://localhost:8080/api/lines/top10StoppingLines`)
    .then(res => {
      temp = res.data;
      setLines(temp)
    });

    
  }, []);

  useEffect(() => {
    if (Object.keys(lines).length > 0) {
      let sortable = [];
      for (var lineArray in lines){
        sortable.push([lineArray, lines[lineArray]]);
      }
      sortable.sort((a, b) => {
        return b[1].length - a[1].length;
      });
      setSortedLines(sortable);
    }
  }, [lines]);

  useEffect(() => {
    if (selectedLine.length > 0){
      axios({
        url: `http://localhost:8080/api/stops/lineStopDetails`,
        method: 'post',
        data: selectedLine
      })
      .then(res => {
        const lines = res.data;
        setStopDetails(lines)
      });
    }
  }, [selectedLine]);

  const getStops = (lineNumberComparer) => {
   
    for (const key in lines) {
      if (Object.hasOwnProperty.call(lines, key)) {
        const element = lines[key];
        let temp = [];
        if (key === lineNumberComparer){
          for (const stopKey in element){
            const stopDetail = element[stopKey];
           
            temp.push(stopDetail.JourneyPatternPointNumber);
          }
          
         setSelectedLine(temp);
          
        }
        
      }
    }
    setActiveLineNr(lineNumberComparer);
  }

  return (
    <div className="App">
    
    
      
      <header className="App-header">
        <p>Simons Tour of Roslagen</p>
        
      
       
      
      </header>
      <div className="contentWrapper">
      {Object.keys(lines).length > 0 ?
      <div> 
        <div className="lineButtonsWrapper">
        {
          sortedLines.map((line) => {
            let currentLine = line[0];
            let className = "lineButton";
            if (currentLine === activeLineNr){
              className = className + " active";
            }
            return(
            
              <div onClick={(e) => getStops(currentLine)} key={currentLine} className={className}>
                  <p key={currentLine} className='lineButtonATag'>{currentLine}</p>
              </div>
            
            )
             
          })
        }
        </div>
        
           
            
            {stopDetails.length > 0 ?
            <div className='stopDetailWrapper'>
              <div className="stop-details-header">
                <h2>Line {activeLineNr}</h2>
                <p className="stop-details-stopcount">{selectedLine.length} stops</p>
              </div>
              
              <div className="stopDetails">
            {stopDetails.map((stop) => {
              
              var ln = stop.StopPointName;
            return (
              <div className="detailLine">
                <a  target="_blank" href={`http://maps.google.com/maps?q=&layer=c&cbll=${stop.LocationNorthingCoordinate},${stop.LocationEastingCoordinate}`}>{ln}</a>
              </div>
            )
            })}
              </div>
            </div>
            :<h4>Select a bus line to see its stops</h4> }
      </div>  
       
      
        :
        <div className="loaderWrapper">
          <PuffLoader loading={true} size={500} />
          <p>Loading your top 10 Buslines with the most stops</p>
        </div>
      }
      </div>
      <div className="footerWrapper">
        <p>Created by Simon Sporrong</p>  
      </div>
    </div>
    
  
  );
}



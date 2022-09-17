import './App.css';
import { useEffect, useRef, useState } from 'react';

function UserControl({addAssignment, clearAssignments}) {
  const [grade, setGrade] = useState("");
  const [weightage, setWeightage] = useState(0.4);


  /**
   * 
   * @param {import('react').FormEvent} e 
   */
  function submitListener(e){
    e.preventDefault()
  }

  function inputValidation(e){
    if (e.target.value.length > 4) return;
    setGrade(e.target.value)
  }
  return (
    <form className='input-field' onSubmit={submitListener}>
      <input type="number" maxLength={3} onChange={inputValidation} value={grade}/>
      <select onChange={e => setWeightage(e.target.value)} value={weightage}>
        <option value={0.4} name="formative">Formative</option>
        <option value={0.6} name="summative">Summative</option>
      </select>
      <button className='btn-add' onClick={() => {if (grade) addAssignment(parseFloat(grade), parseFloat(weightage) )}}>Add</button>
      <button className='btn-clear'  onClick={() => clearAssignments()}>Clear</button>

    </form>
  )
}


function Assignment({
  grade,
  weightage,
  deleteAssignment,
  idx
}) {
  return (
    <div className='assignment'>
      <div className='assignment-details'>
        <div className='assignment-idx'>{idx+1}</div>
        <div className="assignment-data">

          <div >
            <h6>Grade</h6>
            <p>{grade}%</p>
          </div>
          <div>
            <h6>Weightage</h6>
            <p>{weightage === .4 ? "Formative" : "Summative"}</p>
          </div>
        </div>
      </div>
      <button onClick={() => deleteAssignment(idx)}>Delete</button>
    </div>
  )
}
function TotalGrade({avgGrade, isNull, data}){
  function getColor(grade) {
    if (grade >= 90){
      return "#3d0291";
    }
    else if (grade >= 80){
      return "gray";
    }
    else {
      return "red";
    }
  }
  function roundGrade(grade) {
    return Math.round(grade * 10) / 10;
  }

  return (
    <div className='bottom-panel'>
      <div className='total-grade'>
        <h4>Total Grade</h4>
        <p style={{color: getColor(avgGrade) }}>{!isNull ? `${roundGrade(avgGrade)}%` : "N/A"}</p>
      </div>
      <div>
        <h4>Formatives</h4>
        <p style={{color: "black" }}>
          {data.filter(task => task.weightage === .4).length}
        </p>
      </div>
      <div>
        <h4>Summatives</h4>
        <p style={{color: "black" }}>
          {data.filter(task => task.weightage === .6).length}
        </p>
      </div>
    </div>
    
  )
}

function App() {
  const [assignments, setAssignments] = useState([{
    grade: 100,
    weightage: .4
  }]);
  const assignmentsRef = useRef()
  function deleteAssignment(idx) {
    let newAssignments = [...assignments];
    newAssignments = newAssignments.filter((item, i) => i !== idx);
    setAssignments(newAssignments)
  }
  function addAssignment(grade, weightage) {
    setAssignments([...assignments, {grade, weightage}]);
    
  }

  
  useEffect(() => {
    assignmentsRef.current.scrollTop = assignmentsRef.current.scrollHeight;
  }, [assignments])
  function getAvgGrade() {
    let allowed = {
      "formative": true,
      "summative": true
    }
    const summatives = assignments.filter(assignment => assignment.weightage === .6);
    

    
    let summativesAvg;

    if (!summatives.length){
      summativesAvg = 0;
      allowed["summative"] = false;
    }
    else {
      let summativesTotal = summatives
        .map(task => task.grade)
        .reduce((a,b) => a +b, 0);
      summativesAvg = summativesTotal / summatives.length;
    }
    
    

    const formatives = assignments.filter(assignment => assignment.weightage === .4)
    console.log(formatives)
    let formativesAvg;

    if (!formatives.length){
      
      formativesAvg = 0;
      allowed["formative"] = false;
    }
    else {
      let formativesTotal = formatives
        .map(formative => formative.grade)
        .reduce((a,b) => a + b, 0)
      formativesAvg = formativesTotal / formatives.length;
      console.log(formativesTotal)
    }
    console.log(assignments)
    if (!allowed.formative && allowed.summative) return summativesAvg;
    else if (allowed.formative && !allowed.summative) return formativesAvg;
    return (
      summativesAvg * .6 + formativesAvg * .4
    )

  }
  return (
    <div className="App">
      <h1 className='App-title'>Aeries Grade Check</h1>
      <main className='App-wrapper'>
        <div className='App-main'>
          <h2>Grades</h2>
          <div ref={assignmentsRef} className='assignments'>

          
          {assignments.map((assignment, i) => 
            
            <Assignment 
              deleteAssignment={deleteAssignment} 
              key={i}
              idx={i}
              weightage={assignment.weightage} 
              grade={assignment.grade}
            />
          )}
          </div>
          <TotalGrade avgGrade={getAvgGrade()} isNull={assignments.length === 0} data={assignments}/>
          <UserControl clearAssignments={() => setAssignments([])} addAssignment={addAssignment} />
        </div>
      </main>
    </div>
  );
}

export default App;

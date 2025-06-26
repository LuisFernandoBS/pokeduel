const TooltipCustom = ({ active, payload, label }: any) => {
  
  if (active && payload && payload.length) {
    let tipoTooltip = 0;
    if (label) {
      if (payload.length > 1) {
        tipoTooltip = 1; 
      }      
    }else{
      if (payload.length > 1) {
        tipoTooltip = 2; 
      } else {
        tipoTooltip = 3; 
      }
    }

    return (
      <div style={{
        background: 'rgba(0,0,0,0.6)',
        padding: '8px',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '0.875rem'
      }}>

        {tipoTooltip === 0 && (
          <div>
            <p><strong>{label}</strong></p>
            <p>{payload[0].name}: {payload[0].value}</p>
          </div>
        )}
        {tipoTooltip === 1 && (
          <div>
            <p><strong>{label}</strong></p>
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`}>{entry.name}: {entry.value}</p>
            ))}
          </div>
        )}
        {tipoTooltip === 2 && (
          <div>
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`}>{entry.name}: {entry.value}</p>
            ))}
          </div>
        )}
        {tipoTooltip === 3 && (
          <p>{payload[0].name}: {payload[0].value}</p>
        )}
        
      </div>
    );
  }

  return null;
};

export default TooltipCustom;
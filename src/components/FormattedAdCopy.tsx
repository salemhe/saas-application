const FormattedAdCopy = ({ content }) => {
   return (
     <div className="space-y-4">
       {content.split('\n\n').map((section, index) => (
         <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
           {section.split('\n').map((line, lineIndex) => (
             <p key={lineIndex} className={`
               ${line.startsWith('**') && line.endsWith('**') 
                 ? 'font-bold text-lg text-gray-800' 
                 : 'text-gray-600'}
             `}>
               {line.replace(/\*\*/g, '')}
             </p>
           ))}
         </div>
       ))}
     </div>
   );
 };

 export default FormattedAdCopy;
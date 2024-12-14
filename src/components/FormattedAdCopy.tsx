const FormattedAdCopy = ({ content }) => {
   return (
     <div className="space-y-4">
       {content.split('\n\n').map((section: any, index: any) => (
         <div key={index} className="bg-whit  rounded- shadow-">
           {section.split('\n').map((line: any, lineIndex: any) => (
             <p key={lineIndex} className={`text-left
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
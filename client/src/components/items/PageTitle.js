import PageTitleCss from './PageTitle.module.css';

function PageTitle({icon, text}) {

    return (
        <div id={ PageTitleCss.title }>
            { icon }
            <span>{ text }</span>
        </div>
    );
}

export default PageTitle;
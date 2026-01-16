function Tablerow(props)
{
    return(
        <>
            <tr>
                <td>{props.grant.title}</td>
                <td>{props.grant.institution}</td>
            </tr>
        </>
    )
}

export default Tablerow
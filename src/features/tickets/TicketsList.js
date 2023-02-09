import { useGetTicketsQuery } from "./ticketsApiSlice";
import Ticket from "./Ticket";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const TicketsList = () => {
  useTitle("Bug-Zapper: Tickets List");

  const { username, isManager, isAdmin } = useAuth();

  const {
    data: tickets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTicketsQuery("ticketsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = tickets;

    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (ticketId) => entities[ticketId].username === username
      );
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((ticketId) => (
        <Ticket key={ticketId} ticketId={ticketId} />
      ));

    content = (
      <table className="table table--tickets">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th ticket__status">
              Status
            </th>
            <th scope="col" className="table__th ticket__created">
              Created
            </th>
            <th scope="col" className="table__th ticket__updated">
              Updated
            </th>
            <th scope="col" className="table__th ticket__title">
              Title
            </th>
            <th scope="col" className="table__th ticket__username">
              Owner
            </th>
            <th scope="col" className="table__th ticket__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default TicketsList;

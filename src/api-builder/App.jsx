export default () => {
  const createLocalFileDatabase = async () => {
    await fetch('/api-builder/api/database', {
      method: 'post'
    })
  }

  return (
    <div>
      <div>
        <h5>add</h5>
        <div>
          <select name="input" id="input">
            <option value="text">text</option>
            <option value="number">number</option>
          </select>
          <button>input</button>
        </div>

        <hr/>

      </div>
      No database connected.
      <button onClick={createLocalFileDatabase}>Create Local File Database</button>
      <br/>
      <span>This creates a local file, named <i>db.js</i> containing empty object</span>

      <hr/>

      <h5>define schema</h5>

      <div>

      </div>
        <input type='text' placeholder="property"/>
        <select>
          <label>data type</label>
          <option>int</option>
          <option>text</option>
        </select>
      <button>add property</button>
      <div>
        <input type='text' placeholder="table name"/>
        <button>create</button>
      </div>

      <hr/>

      <div>
        All routes by default will have <i>/api</i> as prefix
      </div>
      <div>
        <input type='text' value='/api'/>
        <button>change</button>
      </div>
      <div>
        <select>
          <label name='method'>method</label>
          <option value='get'>get</option>
          <option value='post'>post</option>
        </select>
        <input type='text' placeholder="endpoint" value='/api/' />
        <button>test</button>
        <button>create</button>
      </div>
    </div>
  )
}